import Vue from 'vue';
import { ActionTree, ActionContext } from 'vuex';
import { firestore, firestoreModule } from '../../../firebase/firestore';
import { FirebaseFirestore, DocumentReference, CollectionReference } from '@firebase/firestore-types';

import { CarsState } from '../state';
import { Refuel, RefuelData } from '../model';
import { syncFirestoreCollection, Unsubscribe } from '../../firestore';

function ga() {
  return (Vue as any).$ga;
}

async function loadLatestRefuel(carId: string): Promise<Refuel | null> {
  const snapshot = await firestore
    .collection('refuels')
    .where('carId', '==', carId)
    .orderBy('date', 'desc')
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Refuel;
}

export const actions: ActionTree<CarsState, any> = {
  async loadCarRefuels(context: ActionContext<CarsState, any>, params: { carId: string }): Promise<Unsubscribe> {
    const { carId } = params;
    return syncFirestoreCollection(context, {
      ref: firestore.collection('refuels').where('carId', '==', carId),
      mutationPrefix: 'loadCarRefuels',
      context: { carId },
    });
  },

  async createRefuel({ state, rootGetters }, payload: RefuelData & { carId: string }): Promise<Refuel> {
    const { userId } = rootGetters;
    const { carId, date, mileage, fuelAmount, totalPrice, incomplete } = payload;
    const refuel = {
      ...payload,
      userId,
      createdAt: firestoreModule.FieldValue.serverTimestamp(),
      pricePerLiter: totalPrice / fuelAmount,
    };

    const latestRefuel = await loadLatestRefuel(carId);
    if (latestRefuel) {
      if (latestRefuel.incomplete) {
        refuel.previousIncomplete = true;
      }

      const lastMileage = latestRefuel.mileage;
      const distance = mileage - lastMileage;
      refuel.distance = distance;
      if (!incomplete && !refuel.previousIncomplete) {
        refuel.consumption = fuelAmount / distance;
      }
    }

    const ref = await firestore.collection('refuels').add(refuel);
    const doc = await ref.get();
    const refuelDoc = { ...doc.data(), id: doc.id } as Refuel;

    await firestore.doc(`cars/${carId}`).update({ lastRefuel: refuelDoc });
    ga().event('Refuels', 'create');
    return refuelDoc;
  },

  async deleteRefuel(_, payload: { carId: string; refuelId: string }): Promise<any> {
    const { carId, refuelId } = payload;
    const latest = await loadLatestRefuel(carId);
    if (latest && latest.id !== refuelId) throw new Error(`You can only delete the latest refuel.`);

    await firestore.doc(`refuels/${refuelId}`).delete();

    const newLatest = await loadLatestRefuel(carId);
    await firestore.doc(`cars/${carId}`).update({ lastRefuel: newLatest });
    ga().event('Refuels', 'delete');
  },

  async deleteRefuels(_, payload: { carId: string }): Promise<any> {
    const refuelsColl = firestore.collection('refuels');
    const snapshot = await refuelsColl.where('carId', '==', payload.carId).get();
    if (!snapshot.empty) {
      console.log('Deleting %d refuels of car %s', snapshot.docs.length, payload.carId);
      await Promise.all(snapshot.docs.map(doc => refuelsColl.doc(doc.id).delete()));
    }
  },
};
