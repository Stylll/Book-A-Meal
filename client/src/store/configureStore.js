import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/index';

/**
 * Configures store for redux.
 * Sets the root reducers, initialstate and thunk middleware.
 */

const configureStore = initialState => createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunk),
);

export default configureStore;