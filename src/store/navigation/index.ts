import { Module } from 'vuex';

import { state, NavigationState } from './state';
import { actions } from './actions';
import { mutations } from './mutations';

export { NavigationState } from './state';

export const module: Module<NavigationState, any> = {
  state,
  actions,
  mutations,
};
