import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Index from './components/Index';
import Signup from './components/account/Signup';

export default (
  <div>
    <Switch>
      <Route exact path="/" component={Index} />
      <Route path="/users/signup" component={Signup} />
    </Switch>
  </div>
);