import 'babel-polyfill';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import VueMoment from 'vue-moment';
import 'vue-material/dist/vue-material.min.css';

import './firebase';
import store from './store';
import Application from './app/Application.vue';
import './app/styles.scss';

Vue.use(VueMaterial);
Vue.use(VueMoment);

new Vue({
  el: '#app',
  store,
  render: h => h(Application),
});
