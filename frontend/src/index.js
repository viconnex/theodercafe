import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';
import { fetchUtils } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { API_BASE_URL } from 'utils/constants';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import configureStore from './redux/store';

const history = createHashHistory();

const authProvider = () => Promise.resolve();
const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  // add your own headers here
  options.headers.set('Authorization', `Bearer ${localStorage.jwt_token}`);

  return fetchUtils.fetchJson(url, options);
};

const dataProvider = jsonServerProvider(API_BASE_URL, httpClient);

const store = configureStore({
  authProvider,
  dataProvider,
  history,
});

ReactDOM.render(
  <Provider store={store}>
    <App store={store} />
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
