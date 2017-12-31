import { GetterTree } from 'vuex';
import { AuthState } from './state';

export const getters: GetterTree<AuthState, any> = {
  user: state => state.user,
  userId: state => state.user && state.user.id,
  hasAnyRole: state => (...roles: string[]) => roles.some(role => !!(state.user && state.user.roles[role])),
};
