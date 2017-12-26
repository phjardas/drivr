import Dashboard from './Dashboard';
import Car from './Car';
import NewCar from './NewCar';
import CarRefuels from './CarRefuels';
import CarStatistics from './CarStatistics';
import NewRefuel from './NewRefuel';

export const routes = [
  { path: '/', component: Dashboard },
  { path: '/cars/_new', component: NewCar },
  {
    path: '/cars/:id',
    component: Car,
    children: [{ path: '', component: CarStatistics }, { path: 'refuels', component: CarRefuels }],
  },
  { path: '/cars/:id/refuels/_new', component: NewRefuel },
];
