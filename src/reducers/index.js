import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { intlReducer as intl } from 'react-intl-redux'
import cars from './cars';
import refuels from './refuels';
import auth from './auth';

const rootReducer = combineReducers({
  routing,
  cars,
  refuels,
  auth,
  intl,
});

export default rootReducer;
