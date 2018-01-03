import { Module } from 'vuex';

import { actions } from './actions';
import { mutations } from './mutations';
import { AdminState, state } from './state';

export { AdminState } from './state';

export const module: Module<AdminState, any> = {
  state,
  actions,
  mutations,
};
