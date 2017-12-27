import { MutationTree } from 'vuex';
import { AuthState } from './state';
import { AUTHENTICATED, ANYONYMOUS, SIGNIN_STARTED, SIGNIN_SUCCESS, SIGNIN_FAILED } from './mutation-types';

export const mutations: MutationTree<AuthState> = {
  [AUTHENTICATED](state, { user }) {
    state.user = { ...user, authenticated: true, anonymous: false };
  },

  [ANYONYMOUS](state) {
    state.user = { anonymous: true, authenticated: false };
  },

  [SIGNIN_STARTED](state, { providerId }) {
    state.signin = { pending: true, error: null, providerId };
  },

  [SIGNIN_SUCCESS](state) {
    state.signin = { ...state.signin, pending: false, error: null };
  },

  [SIGNIN_FAILED](state, { error }) {
    state.signin = { ...state.signin, pending: false, error };
  },
};
