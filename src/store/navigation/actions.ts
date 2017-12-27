import { ActionTree } from 'vuex';
import { NavigationState } from './state';

export const actions: ActionTree<NavigationState, any> = {
  setPageTitle({ commit }, payload) {
    commit('setPageTitle', payload);
  },

  setAppDrawerVisibility({ commit }, payload) {
    commit('setAppDrawerVisibility', payload);
  },
};
