import { MutationTree } from 'vuex';
import { AdminState } from './state';
import { mapDocMutations } from '../firestore';

export const mutations: MutationTree<AdminState> = {
  ...mapDocMutations({
    prefix: 'adminStatistics',
    statePath: ['statistics'],
  }),
};
