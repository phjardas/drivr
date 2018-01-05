import { RouteConfig } from 'vue-router';

const Admin = () => import(/* webpackChunkName: "admin" */ './Admin.vue');
const Statistics = () => import(/* webpackChunkName: "admin" */ './Statistics.vue');

export const routes: RouteConfig[] = [
  {
    path: '/admin',
    component: Admin,
    children: [
      { path: '', redirect: 'statistics' },
      { path: 'statistics', name: 'admin-statistics', component: Statistics },
    ],
    meta: { anyRole: ['admin'] },
  },
];
