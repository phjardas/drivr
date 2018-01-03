import { MutationTree } from 'vuex';
import { CarsState } from './state';
import { mapCollectionMutations } from '../firestore';

export const mutations: MutationTree<CarsState> = {
  ...mapCollectionMutations({
    prefix: 'loadCars',
    statePath: ['cars'],
  }),
  ...mapCollectionMutations({
    prefix: 'loadCarRefuels',
    statePath: (context: any) => {
      return ['refuels', context.carId];
    },
  }),
};
