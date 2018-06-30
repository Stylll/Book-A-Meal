import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Index from './components/Index';
import Signup from './components/account/Signup';
import Signin from './components/account/Signin';
import EditMeal from './components/meals/EditMeal';
import ManageMeals from './components/meals/ManageMeals';
import EditMenu from './components/menu/EditMenu';
import ManageMenus from './components/menu/ManageMenus';
import ViewMeals from './components/menu/ViewMeals';

export default (
  <div>
    <Switch>
      <Route exact path="/" component={Index} />
      <Route path="/users/signup" component={Signup} />
      <Route path="/users/signin" component={Signin} />
      <Route exact path="/caterer/meals" component={ManageMeals} />
      <Route exact path="/caterer/meals/edit" component={EditMeal} />
      <Route exact path="/caterer/meals/edit/:id" component={EditMeal} />
      <Route exact path="/caterer/meals/edit" component={EditMeal} />
      <Route exact path="/caterer/menus" component={ManageMenus} />
      <Route exact path="/caterer/menus/edit" component={EditMenu} />
      <Route exact path="/caterer/menus/edit/:id" component={EditMenu} />
      <Route exact path="/caterer/menus/view/:id" component={ViewMeals} />
    </Switch>
  </div>
);