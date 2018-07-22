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
import CurrentMenu from './components/menu/CurrentMenu';
import EditOrder from './components/orders/EditOrder';
import ViewOrders from './components/orders/ViewOrders';
import MyPendingOrders from './components/orders/MyPendingOrders';
import CatererViewOrders from './components/orders/CatererViewOrders';
import CatererPendingOrders from './components/orders/CatererPendingOrders';
import OrderSummary from './components/orders/OrderSummary';

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
      <Route exact path="/customer/menu" component={CurrentMenu} />
      <Route exact path="/customer/orders/confirm/:mealId" component={EditOrder} />
      <Route exact path="/customer/orders/edit/:id" component={EditOrder} />
      <Route exact path="/customer/orders" component={ViewOrders} />
      <Route exact path="/customer/orders/pending" component={MyPendingOrders} />
      <Route exact path="/caterer/orders" component={CatererViewOrders} />
      <Route exact path="/caterer/orders/pending" component={CatererPendingOrders} />
      <Route exact path="/caterer/orders/summary" component={OrderSummary} />
    </Switch>
  </div>
);
