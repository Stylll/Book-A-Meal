import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar';
import authReducer from './authReducer';

/**
 * Reducers combiner
 * This combines all the reducers for redux
 */

const rootReducer = combineReducers({
  auth: authReducer,
  loadingBar: loadingBarReducer,
});

export default rootReducer;