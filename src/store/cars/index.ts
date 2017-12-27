import { Module } from 'vuex';

import { actions } from './actions';
import { CarsState, state } from './state';

export { CarsState, Car, Refuel } from './state';

export const module: Module<CarsState, any> = {
  state,
  actions,
};
