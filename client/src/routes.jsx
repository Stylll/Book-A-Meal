import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Index from './components/Index';
import Signup from './components/account/Signup';
import Signin from './components/account/Signin';

export default (
  <div>
    <Switch>
      <Route exact path="/" component={Index} />
      <Route path="/users/signup" component={Signup} />
      <Route path="/users/signin" component={Signin} />
    </Switch>
  </div>
);