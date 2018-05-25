import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar';
import { reducer as toastrReducer } from 'react-redux-toastr';
import authReducer from './authReducer';

/**
 * Reducers combiner
 * This combines all the reducers for redux
 */

const rootReducer = combineReducers({
  auth: authReducer,
  loadingBar: loadingBarReducer,
  toastr: toastrReducer,
});

export default rootReducer;