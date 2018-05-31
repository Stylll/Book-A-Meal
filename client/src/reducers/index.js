import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar';
import { reducer as toastrReducer } from 'react-redux-toastr';
import authReducer from './authReducer';
import mealReducer from './mealReducer';

/**
 * Reducers combiner
 * This combines all the reducers for redux
 */

const rootReducer = combineReducers({
  auth: authReducer,
  meals: mealReducer,
  loadingBar: loadingBarReducer,
  toastr: toastrReducer,
});

export default rootReducer;