import { RouteConfig } from 'vue-router';

import Dashboard from './Dashboard.vue';
import Car from './Car.vue';
import NewCar from './NewCar.vue';
import CarRefuels from './CarRefuels.vue';
import CarStatistics from './CarStatistics.vue';
import CarCharts from './CarCharts.vue';
import CarSettings from './CarSettings.vue';
import NewRefuel from './NewRefuel.vue';
import AcceptInvite from './AcceptInvite.vue';

export const routes: RouteConfig[] = [
  { path: '/', name: 'cars-dashboard', component: Dashboard },
  { path: '/invite/:id', name: 'accept-invite', component: AcceptInvite },
  { path: '/cars/_new', name: 'new-car', component: NewCar },
  {
    path: '/cars/:id',
    component: Car,
    children: [
      { path: '', name: 'car-statistics', component: CarStatistics },
      { path: 'refuels', name: 'car-refuels', component: CarRefuels },
      { path: 'charts', name: 'car-charts', component: CarCharts },
      { path: 'settings', name: 'car-settings', component: CarSettings },
    ],
  },
  { path: '/cars/:id/refuels/_new', name: 'new-refuel', component: NewRefuel },
];
