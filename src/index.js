import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-intl-redux';
import store from './store';
import routes from './routes';
import { syncHistoryWithStore } from 'react-router-redux';
import { setLocale } from './i18n/actions';

// require('./favicon.ico');
import './styles/styles.scss';

const history = syncHistoryWithStore(browserHistory, store);
store.dispatch(setLocale('en'));

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('app')
);
