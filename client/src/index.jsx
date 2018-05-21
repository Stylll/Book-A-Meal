import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';

const Test = (props) => {
  return (
    <div>
      <p>This is a react component</p>
    </div>
  );
};

render (
  <Test />,
  document.getElementById('app')
);