import { Module } from 'vuex';
import { actions } from './actions';
import { mutations } from './mutations';

export const module: Module<any, any> = {
  actions,
};

export { mutations };
