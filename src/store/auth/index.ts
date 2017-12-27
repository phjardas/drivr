import { Module } from 'vuex';

import { state, AuthState } from './state';
import { actions } from './actions';
import { mutations } from './mutations';
import { getters } from './getters';

export { AuthState, User } from './state';

export const module: Module<AuthState, any> = { state, getters, actions, mutations };
