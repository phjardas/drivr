import { Module } from 'vuex';

import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { CarsState, state } from './state';

export { Car } from './model';
export { CarsState } from './state';

export const module: Module<CarsState, any> = {
  state,
  actions,
  getters,
  mutations,
};
