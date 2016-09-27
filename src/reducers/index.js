import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import cars from './cars';
import refuels from './refuels';
import auth from './auth';

const rootReducer = combineReducers({
  routing,
  cars,
  refuels,
  auth,
});

export default rootReducer;
