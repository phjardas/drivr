import { ActionTree } from 'vuex';
import { firestore, firestoreModule } from '../../firebase';
import { RootState } from '../state';
import { InvitesState } from './state';
import { InviteData, Invite, CarInfo, UserInfo } from './model';
import {
  INVITE_LOAD_STARTED,
  INVITE_LOAD_DONE,
  INVITE_LOAD_FAILED,
  INVITE_ACCEPT_STARTED,
  INVITE_ACCEPT_DONE,
  INVITE_ACCEPT_FAILED,
} from './types';

const invitesRef = firestore.collection('invites');

async function loadInvite(id: string): Promise<Invite> {
  const doc = await invitesRef.doc(id).get();

  if (!doc.exists) {
    throw new Error('Invite not found');
  }

  return { id: doc.id, ...doc.data() } as any;
}

export const actions: ActionTree<InvitesState, RootState> = {
  async createCarInvite({ commit, rootState }, payload: { carId: string }): Promise<Invite> {
    const user = rootState.auth.user;
    if (!user || !user.id) throw new Error('Unauthenticated!');
    const inviter: UserInfo = { id: user.id, label: user.label || '' };
    const carData = rootState.cars.items[payload.carId];
    if (!carData) throw new Error(`Invalid car ID: ${payload.carId}`);
    const car: CarInfo = { id: carData.id, label: carData.licensePlate };
    const invite: InviteData = { inviter, car };
    const inviteRef = await invitesRef.add({ ...invite, createdAt: firestoreModule.FieldValue.serverTimestamp() });
    return loadInvite(inviteRef.id);
  },

  async loadCarInvite({ commit }, payload: { inviteId: string }) {
    commit(INVITE_LOAD_STARTED, payload);

    try {
      const invite = await loadInvite(payload.inviteId);
      commit(INVITE_LOAD_DONE, { ...payload, invite });
    } catch (err) {
      commit(INVITE_LOAD_FAILED, { ...payload, error: { message: err.message } });
    }
  },

  async acceptCarInvite({ commit, rootState }, payload: { inviteId: string }) {
    commit(INVITE_ACCEPT_STARTED, payload);

    try {
      // check whether the invite exists in the first place
      const invite = await loadInvite(payload.inviteId);

      // check for user authentication
      const user = rootState.auth.user;
      if (!user || !user.id) throw new Error('Unauthenticated!');
      if (invite.inviter.id === user.id) throw new Error('You cannot accept your own invitation');
      const invitee: UserInfo = { id: user.id, label: user.label || '' };

      console.log('Accepting invite %s for', payload.inviteId, invitee);

      await firestore.runTransaction(async tx => {
        // check if invite was already accepted
        const inviteRef = invitesRef.doc(payload.inviteId);
        const doc = await tx.get(inviteRef);
        if (doc.data().acceptedAt) throw new Error('Invite was already accepted');

        // now mark the invite as accepted
        await tx.update(inviteRef, { invitee, acceptedAt: firestoreModule.FieldValue.serverTimestamp() });

        const carShareData = {
          inviteId: invite.id,
          inviteeId: invitee.id,
          ownerId: invite.inviter.id,
          carId: invite.car.id,
          sharedAt: invite.createdAt,
          acceptedAt: firestoreModule.FieldValue.serverTimestamp(),
        };
        await tx.set(firestore.doc(`users/${invitee.id}/sharedCars/${invite.car.id}`), carShareData);
        await tx.set(
          firestore.doc(`users/${invite.inviter.id}/cars/${invite.car.id}/shares/${invitee.id}`),
          carShareData
        );
      });

      commit(INVITE_ACCEPT_DONE, { ...payload, invitee });
    } catch (err) {
      commit(INVITE_ACCEPT_FAILED, {
        ...payload,
        error: { message: err.message },
      });
    }
  },
};
