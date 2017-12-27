import { GetterTree } from 'vuex';
import { AuthState } from './state';

export const getters: GetterTree<AuthState, any> = {
  userId: state => state.user && state.user.id,
};
