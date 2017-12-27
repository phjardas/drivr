import * as firebase from 'firebase';
import { ActionTree } from 'vuex';

import { AuthState } from './state';
import { AUTHENTICATED, ANYONYMOUS, SIGNIN_STARTED, SIGNIN_SUCCESS, SIGNIN_FAILED } from './mutation-types';

const { auth } = firebase;
if (!auth) throw new Error('Firebase authentication is not available');

// FIXME auth.AuthProvider doesn't work :/
type Provider = () => any;

const providers: { [id: string]: Provider } = {
  google: () => new auth.GoogleAuthProvider(),
  github: () => new auth.GithubAuthProvider(),
  twitter: () => new auth.TwitterAuthProvider(),
  facebook: () => new auth.FacebookAuthProvider(),
};

export interface SignInParams {
  providerId: string;
}

export const actions: ActionTree<AuthState, any> = {
  INIT({ commit }) {
    auth().onAuthStateChanged(user => {
      if (user) {
        commit(AUTHENTICATED, {
          user: {
            id: user.uid,
            displayName: user.displayName,
            email: user.email,
            label: user.displayName || user.email,
          },
        });
      } else {
        commit(ANYONYMOUS);
      }
    });
  },

  async signInWithProvider({ commit }, payload: SignInParams): Promise<any> {
    commit(SIGNIN_STARTED, payload);

    try {
      const { providerId } = payload;
      const providerFactory = providers[providerId];
      if (!providerFactory) throw new Error(`Invalid provider ID: ${providerId}`);
      const provider = providerFactory();
      await auth().signInWithPopup(provider);
      commit(SIGNIN_SUCCESS, { ...payload });
    } catch (error) {
      commit(SIGNIN_FAILED, { ...payload, error: { code: error.code, message: error.message } });
      throw error;
    }
  },

  signOut(): Promise<any> {
    return auth().signOut();
  },
};
