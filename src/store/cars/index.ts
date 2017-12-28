import { Module } from 'vuex';

import { actions } from './actions';
import { CarsState, state } from './state';

export { Car, Refuel } from './model';
export { CarsState } from './state';

export const module: Module<CarsState, any> = {
  state,
  actions,
};
