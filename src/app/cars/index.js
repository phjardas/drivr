import Car from './Car';
import CarRefuels from './CarRefuels';
import CarStatistics from './CarStatistics';
import NewRefuel from './NewRefuel';

export const routes = [
  {
    path: '/cars/:id',
    component: Car,
    children: [{ path: '', component: CarStatistics }, { path: 'refuels', component: CarRefuels }],
  },
  { path: '/cars/:id/refuels/_new', component: NewRefuel },
];
