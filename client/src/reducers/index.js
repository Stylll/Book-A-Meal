import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar';
import { reducer as toastrReducer } from 'react-redux-toastr';
import authReducer from './authReducer';
import mealReducer from './mealReducer';
import menuReducer from './menuReducer';
import orderReducer from './orderReducer';
import * as types from '../actions/actionTypes';

/**
 * Reducers combiner
 * This combines all the reducers for redux
 */

const appReducer = combineReducers({
  auth: authReducer,
  meals: mealReducer,
  menus: menuReducer,
  orders: orderReducer,
  loadingBar: loadingBarReducer,
  toastr: toastrReducer,
});

const rootReducer = (state, action) => {
  if (action.type === types.LOGOUT) {
    /* eslint-disable no-param-reassign */
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
