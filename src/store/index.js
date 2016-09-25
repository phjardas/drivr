import reducer from '../reducers';
import configureStore from './configureStore';
import initialState from './initialState';

const store = configureStore(initialState, reducer);
export default store;
