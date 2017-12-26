import * as firebase from 'firebase';
import { AUTHENTICATED, ANYONYMOUS, SIGNIN_STARTED, SIGNIN_SUCCESS, SIGNIN_FAILED } from './mutation-types';

const providers = {
  google: () => new firebase.auth.GoogleAuthProvider(),
  github: () => new firebase.auth.GithubAuthProvider(),
  twitter: () => new firebase.auth.TwitterAuthProvider(),
  facebook: () => new firebase.auth.FacebookAuthProvider(),
};

export default {
  INIT({ commit }) {
    firebase.auth().onAuthStateChanged(user => {
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

  async signInWithProvider({ commit }, payload) {
    commit(SIGNIN_STARTED, payload);

    try {
      const { providerId } = payload;
      const providerFactory = providers[providerId];
      if (!providerFactory) throw new Error(`Invalid provider ID: ${providerId}`);
      const provider = providerFactory();
      await firebase.auth().signInWithPopup(provider);
      commit(SIGNIN_SUCCESS, { ...payload });
    } catch (error) {
      commit(SIGNIN_FAILED, { ...payload, error: { code: error.code, message: error.message } });
    }
  },

  signOut() {
    firebase.auth().signOut();
  },
};
