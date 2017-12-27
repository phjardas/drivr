import 'babel-polyfill';
import Vue from 'vue';

import './firebase';
import { store } from './store';
import Application from './app/Application';

import 'vue-material/dist/vue-material.min.css';
import './app/styles.scss';

Vue.use(require('vue-material').default);
Vue.use(require('vue-moment'));

new Vue({
  el: '#app',
  store,
  render: h => h(Application),
});
