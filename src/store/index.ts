import Vue from 'vue';
import Vuex, { Store } from 'vuex';

import { module as auth } from './auth';
import { module as cars } from './cars';
import { module as navigation } from './navigation';
import { mutations as firestoreMutations, module as firestore } from './firestore';
import { RootState } from './state';

Vue.use(Vuex);

export const store = new Store<RootState>({
  modules: {
    auth,
    cars,
    firestore,
    navigation,
  },
  mutations: { ...firestoreMutations },
  plugins: [store => store.dispatch('INIT')],
  strict: process.env.NODE_ENV !== 'production',
});

if (module.hot) {
  module.hot.accept(['./auth'], () => store.hotUpdate({ modules: { auth: require('./auth').default } }));
  module.hot.accept(['./cars'], () => store.hotUpdate({ modules: { cars: require('./cars').default } }));
  module.hot.accept(['./firestore'], () => store.hotUpdate({ modules: { firestore: require('./firestore').default } }));
  module.hot.accept(['./navigation'], () =>
    store.hotUpdate({ modules: { navigation: require('./navigation').default } })
  );
}
