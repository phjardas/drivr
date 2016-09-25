import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import carsReducer from './cars';

const rootReducer = combineReducers({
  routing: routerReducer,
  cars: carsReducer,
});

export default rootReducer;
