import axios from 'axios';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { toastr } from 'react-redux-toastr';
import * as types from './actionTypes';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import api from '../utils/api';
import { getMessageValue } from '../utils/utils';

/**
 * action to handle signup events
 * @param {object} signupDetails
 * @returns {func} dispatch
 */
const signup = signupDetails => function (dispatch) {
  dispatch(showLoading());
  return axios.post(api.user.signUp, signupDetails)
    .then((resp) => {
      /* eslint-disable no-undef */
      localStorage.setItem('jwtToken', resp.data.token);
      setAuthorizationToken(resp.data.token);
      dispatch(signupSuccess(resp.data.user));
      dispatch(hideLoading());
    })
    .catch((err) => {
      dispatch(signupFailed(err.response.data.errors));
      dispatch(hideLoading());
    });
};

/**
 * Action to handle successful signup
 * @param {object} user
 * @returns {object} action object for reducer
 */
const signupSuccess = (user) => {
  toastr.success('', `Welcome, ${user.username}`);
  return {
    type: types.SIGNUP_SUCCESS,
    user,
  };
};

/**
 * Action to handle failed signup
 * @param {object} errors
 * @returns {object} action object for reducer
 */
const signupFailed = (errors) => {
  toastr.error('', 'Signup failed');
  return {
    type: types.SIGNUP_FAILED,
    errors: getMessageValue(errors),
  };
};

export {
  signup,
  signupSuccess,
  signupFailed,
};