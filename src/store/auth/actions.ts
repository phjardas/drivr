import { auth, authModule, firestore, firestoreModule } from '../../firebase';
import { AuthProvider } from '@firebase/auth-types';
import { ActionTree } from 'vuex';

import { AuthState, UserData } from './state';
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
  async INIT({ commit }) {
    auth.onAuthStateChanged(async fbUser => {
      if (!fbUser) {
        return commit(ANYONYMOUS);
      }

      const user: UserData = {
        id: fbUser.uid,
      };
      if (fbUser.displayName) user.displayName = fbUser.displayName;
      if (fbUser.email) user.email = fbUser.email;
      user.label = user.displayName || user.email;

      const userRef = firestore.doc(`/users/${user.id}`);
      const dbUser = await userRef.get();

      if (dbUser.exists) {
        userRef.update({ ...user, lastLogin: firestoreModule.FieldValue.serverTimestamp() });
      } else {
        userRef.set({
          ...user,
          createdAt: firestoreModule.FieldValue.serverTimestamp(),
          lastLogin: firestoreModule.FieldValue.serverTimestamp(),
        });
      }

      commit(AUTHENTICATED, {
        user,
      });
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
