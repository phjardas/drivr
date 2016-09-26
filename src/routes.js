import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import HomePage from './components/HomePage';
import CarList from './components/cars/CarList';
import CarDetails from './components/cars/CarDetails';
import CreateCar from './components/cars/create/CreateCar';
import CreateRefuel from './components/refuels/create/CreateRefuel';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage}/>
    <Route path="/cars" component={CarList} />"
    <Route path="/cars/_new" component={CreateCar} />"
    <Route path="/cars/:carId" component={CarDetails} />"
    <Route path="/refuels/_new" component={CreateRefuel} />"
  </Route>
);
