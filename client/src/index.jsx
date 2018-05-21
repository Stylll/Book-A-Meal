import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

/* eslint-disable no-undef */
const Test = props => (
    <div>
      <p>This is a react component</p>
    </div>
);

render(
  <Test />,
  document.getElementById('app'),
);