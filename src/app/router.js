import Vue from 'vue';
import VueRouter from 'vue-router';

import { routes as carsRoutes } from './cars';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [...carsRoutes],
});
