import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Index from './components/Index';

export default (
  <div>
    <Switch>
      <Route exact path="/" component={Index} />
    </Switch>
  </div>
);