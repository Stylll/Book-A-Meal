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
import setAuthorizationToken from './utils/setAuthorizationToken';
import { signinSuccess } from './actions/authActions';
import './styles/style.scss';


/* eslint-disable no-undef */

const store = configureStore(initialState);
// if token exists then log user in
if (localStorage.jwtToken) {
  setAuthorizationToken(localStorage.jwtToken);
  store.dispatch(signinSuccess(jwt.decode(localStorage.jwtToken).user));
}

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