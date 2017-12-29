import { ActionTree } from 'vuex';
import { CarsState } from '../state';
import { actions as car } from './car-actions';
import { actions as refuel } from './refuel-actions';

export const actions: ActionTree<CarsState, any> = { ...car, ...refuel };
