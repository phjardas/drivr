import Vue from 'vue';
import Vuex, { Store } from 'vuex';

import { module as admin } from './admin';
import { module as auth } from './auth';
import { module as cars } from './cars';
import { module as invites } from './invites';
import { module as navigation } from './navigation';
import { RootState } from './state';

Vue.use(Vuex);

export const store = new Store<RootState>({
  modules: {
    admin,
    auth,
    cars,
    invites,
    navigation,
  },
  plugins: [store => store.dispatch('INIT')],
  strict: process.env.NODE_ENV !== 'production',
});

if (module.hot) {
  module.hot.accept(['./admin'], () => store.hotUpdate({ modules: { admin: require('./admin').default } }));
  module.hot.accept(['./auth'], () => store.hotUpdate({ modules: { auth: require('./auth').default } }));
  module.hot.accept(['./cars'], () => store.hotUpdate({ modules: { cars: require('./cars').default } }));
  module.hot.accept(['./invites'], () => store.hotUpdate({ modules: { invites: require('./invites').default } }));
  module.hot.accept(['./navigation'], () =>
    store.hotUpdate({ modules: { navigation: require('./navigation').default } })
  );
}
