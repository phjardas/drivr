import {createStore, compose, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

export default function configureStore(initialState, reducer) {
  const middewares = [
    thunkMiddleware,
  ];

  return createStore(reducer, initialState, compose(
    applyMiddleware(...middewares)
  ));
}
