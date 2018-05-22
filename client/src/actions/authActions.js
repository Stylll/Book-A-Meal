import axios from 'axios';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import * as types from './actionTypes';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import api from '../utils/api';

/**
 * action to handle signup events
 * @param {object} signupDetails
 * @returns {func} dispatch
 */
const signup = (signupDetails) => {
  return function (dispatch) {
    dispatch(showLoading());
    return axios.post(api.user.signUp, signupDetails)
      .then((resp) => {
        localStorage.setItem('jwtToken', resp.data.token);
        setAuthorizationToken(jwtToken);
        dispatch(signupSuccess(resp.data.user));
        dispatch(hideLoading());
      })
      .catch((err) => {
        dispatch(signupFailed(err.response.data.message));
        dispatch(hideLoading());
      });
  };
};

/**
 * Action to handle successful signup
 * @param {object} user
 * @returns {object} action object for reducer
 */
const signupSuccess = (user) => {
  return {
    type: types.SIGNUP_SUCCESS,
    user,
  };
};

/**
 * Action to handle failed signup
 * @param {object} message
 * @returns {object} action object for reducer
 */
const signupFailed = (message) => {
  return {
    type: types.SIGNUP_FAILED,
    message,
  };
};

export default {
  signup,
  signupSuccess,
  signupFailed,
};