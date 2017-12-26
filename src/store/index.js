import Vue from 'vue';
import Vuex from 'vuex';

import auth from './auth';
import cars from './cars';
import navigation from './navigation';
import { mutations as firestoreMutations, module as firestore } from './firestore';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  modules: {
    auth,
    cars,
    firestore,
    navigation,
  },
  mutations: { ...firestoreMutations },
  plugins: [store => store.dispatch('INIT')],
  strict: debug,
});

if (module.hot) {
  module.hot.accept(['./auth'], () => store.hotUpdate({ modules: { auth: require('./auth').default } }));
  module.hot.accept(['./cars'], () => store.hotUpdate({ modules: { cars: require('./cars').default } }));
  module.hot.accept(['./firestore'], () => store.hotUpdate({ modules: { firestore: require('./firestore').default } }));
  module.hot.accept(['./navigation'], () =>
    store.hotUpdate({ modules: { navigation: require('./navigation').default } })
  );
}

export default store;
