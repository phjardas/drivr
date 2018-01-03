import { MutationTree } from 'vuex';
import { NavigationState } from './state';

export const mutations: MutationTree<NavigationState> = {
  setPageTitle(state, { title }) {
    state.title = title;
  },
};
