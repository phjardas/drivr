import { auth, authModule } from '../../firebase';
import { AuthProvider } from '@firebase/auth-types';
import { ActionTree } from 'vuex';

import { AuthState } from './state';
import { AUTHENTICATED, ANYONYMOUS, SIGNIN_STARTED, SIGNIN_SUCCESS, SIGNIN_FAILED } from './mutation-types';

type Provider = () => AuthProvider;

const providers: { [id: string]: Provider } = {
  google: () => new authModule.GoogleAuthProvider(),
  github: () => new authModule.GithubAuthProvider(),
  twitter: () => new authModule.TwitterAuthProvider(),
  facebook: () => new authModule.FacebookAuthProvider(),
};

export interface SignInParams {
  providerId: string;
}

export const actions: ActionTree<AuthState, any> = {
  INIT({ commit }) {
    auth.onAuthStateChanged(user => {
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
      await auth.signInWithPopup(provider);
      commit(SIGNIN_SUCCESS, { ...payload });
    } catch (error) {
      commit(SIGNIN_FAILED, { ...payload, error: { code: error.code, message: error.message } });
      throw error;
    }
  },

  signOut(): Promise<any> {
    return auth.signOut();
  },
};
