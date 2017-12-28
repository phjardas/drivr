import Vue from 'vue';
import { MutationTree } from 'vuex';
import { Invite } from './model';
import { InvitesState } from './state';
import {
  INVITE_LOAD_STARTED,
  INVITE_LOAD_DONE,
  INVITE_LOAD_FAILED,
  INVITE_ACCEPT_STARTED,
  INVITE_ACCEPT_DONE,
  INVITE_ACCEPT_FAILED,
} from './types';

export const mutations: MutationTree<InvitesState> = {
  [INVITE_LOAD_STARTED](state, payload: { inviteId: string }) {
    Vue.set(state.invites, payload.inviteId, { loading: true });
  },
  [INVITE_LOAD_DONE](state, payload: { inviteId: string; invite: Invite }) {
    Vue.set(state.invites, payload.inviteId, { loading: false, entity: payload.invite });
  },
  [INVITE_LOAD_FAILED](state, payload: { inviteId: string; error: { message: string } }) {
    Vue.set(state.invites, payload.inviteId, { loading: false, error: payload.error });
  },

  [INVITE_ACCEPT_STARTED](state, payload: { inviteId: string }) {
    Vue.set(state.accepts, payload.inviteId, { loading: true });
  },
  [INVITE_ACCEPT_DONE](state, payload: { inviteId: string }) {
    Vue.set(state.accepts, payload.inviteId, { loading: false, entity: {} });
  },
  [INVITE_ACCEPT_FAILED](state, payload: { inviteId: string; error: { message: string } }) {
    Vue.set(state.accepts, payload.inviteId, { loading: false, error: payload.error });
  },
};
