import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import HomePage from './components/HomePage';
import CarList from './components/CarList';
import CarDetails from './components/CarDetails';
import CreateRefuel from './components/refuels/form/CreateRefuel';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage}/>
    <Route path="/cars" component={CarList} />"
    <Route path="/cars/:carId" component={CarDetails} />"
    <Route path="/refuels/_new" component={CreateRefuel} />"
  </Route>
);
