import 'babel-polyfill';
import Vue from 'vue';

import './firebase';
import './material';
import { store } from './store';
import Application from './app/Application';

import './app/styles.scss';

Vue.use(require('vue-moment'));

new Vue({
  el: '#app',
  store,
  render: h => h(Application),
});
