import initialState from './initialState';
import * as types from '../actions/actionTypes';

const authReducer = (state = initialState.auth, action) => {
  switch (action.type) {
    case types.SIGNUP_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isCaterer: (action.user.accountType === 'caterer' || action.user.accountType === 'admin'),
        user: action.user,
        errors: {},
      };

    case types.SIGNUP_FAILED:
      return {
        ...state,
        errors: action.errors,
      };

    case types.SIGNIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isCaterer: (action.user.accountType === 'caterer' || action.user.accountType === 'admin'),
        user: action.user,
        errors: {},
      };

    case types.SIGNIN_FAILED:
      return {
        ...state,
        errors: action.errors,
      };

    case types.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        isCaterer: false,
        user: {},
      };

    default:
      return state;
  }
};

export default authReducer;