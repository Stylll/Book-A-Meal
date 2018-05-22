import initialState from './initialState';
import * as types from '../actions/actionTypes';

const authReducer = (state = initialState.auth, action) => {
  switch (action.type) {
    case types.SIGNUP_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.user,
      };

    default:
      return state;
  }
};

export default authReducer;