import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, browserHistory } from 'react-router-dom';
import routes from './routes';
import './styles/style.scss';

/* eslint-disable no-undef */
const Test = props => (
    <div>
      <p>This is a react component</p>
    </div>
);

render(
  <Router history={browserHistory}>
    {routes}
  </Router>,
  document.getElementById('app'),
);