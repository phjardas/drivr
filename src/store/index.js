import reducer from '../reducers';
import initialState from './initialState';
import configureStoreDev from './configureStore.dev';
import configureStoreProd from './configureStore.prod';

const configureStore = process.env.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev;

export default configureStore(initialState, reducer);
