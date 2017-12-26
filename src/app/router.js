import Vue from 'vue';
import VueRouter from 'vue-router';

import Dashboard from './Dashboard';
import { routes as carsRoutes } from './cars';

Vue.use(VueRouter);

const routes = [{ path: '/', component: Dashboard }, ...carsRoutes];

export default new VueRouter({
  mode: 'history',
  routes,
});
