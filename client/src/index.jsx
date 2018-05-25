import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, browserHistory } from 'react-router-dom';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import jwt from 'jsonwebtoken';
import 'react-redux-toastr/src/styles/index.scss';
import routes from './routes';
import configureStore from './store/configureStore';
import initialState from './reducers/initialState';
import './styles/style.scss';
import './styles/signup.scss';


/* eslint-disable no-undef */

const store = configureStore(initialState);

render(
  <Provider store={store}>
    <div>
    <ReduxToastr />
    <Router history={browserHistory}>
      {routes}
    </Router>
    </div>
  </Provider>,
  document.getElementById('app'),
);