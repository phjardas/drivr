import Vue from 'vue';
import VueRouter from 'vue-router';

import { checkGuard } from '../lib/guards';
import { routes as adminRoutes } from './admin';
import { routes as carsRoutes } from './cars';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [...adminRoutes, ...carsRoutes],
});

router.beforeEach(checkGuard);

export default router;
