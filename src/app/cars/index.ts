import { RouteConfig } from 'vue-router';

import Dashboard from './Dashboard.vue';
import Car from './Car.vue';
import NewCar from './NewCar.vue';
import CarRefuels from './CarRefuels.vue';
import CarStatistics from './CarStatistics.vue';
import CarSettings from './CarSettings.vue';
import NewRefuel from './NewRefuel.vue';

export const routes: RouteConfig[] = [
  { path: '/', component: Dashboard },
  { path: '/cars/_new', component: NewCar },
  {
    path: '/cars/:id',
    component: Car,
    children: [
      { path: '', component: CarStatistics },
      { path: 'refuels', component: CarRefuels },
      { path: 'settings', component: CarSettings },
    ],
  },
  { path: '/cars/:id/refuels/_new', component: NewRefuel },
];
