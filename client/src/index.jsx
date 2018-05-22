import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, browserHistory } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt from 'jsonwebtoken';
import routes from './routes';
import configureStore from './store/configureStore';
import initialState from './reducers/initialState';
import './styles/style.scss';

const store = configureStore(initialState);

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('app'),
);