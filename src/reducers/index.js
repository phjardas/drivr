import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import carsReducer from './cars';
import refuelsReducer from './refuels';

const rootReducer = combineReducers({
  routing: routerReducer,
  cars: carsReducer,
  refuels: refuelsReducer,
});

export default rootReducer;
