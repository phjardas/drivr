import { MutationTree } from 'vuex';
import { CarsState } from './state';
import { mapMutations } from '../firestore';

export const mutations: MutationTree<CarsState> = {
  ...mapMutations({
    prefix: 'loadCars',
    statePath: ['cars'],
  }),
  ...mapMutations({
    prefix: 'loadCarRefuels',
    statePath: (context: any) => {
      return ['refuels', context.carId];
    },
  }),
};
