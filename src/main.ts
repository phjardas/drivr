import 'babel-polyfill';
import Vue from 'vue';
import Vuetify from 'vuetify';

import { theme } from './theme';
import { store } from './store';
import Application from './app/Application.vue';

import './app/styles.scss';

Vue.use(Vuetify, { theme });
Vue.use(require('vue-moment'));

new Vue({
  el: '#app',
  store,
  render: h => h(Application),
});
