import axios from 'axios';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { toastr } from 'react-redux-toastr';
import * as types from './actionTypes';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import api from '../utils/api';
import { getMessageValue } from '../utils/utils';
import { getMeals } from './mealActions';
import { getMenus } from './menuActions';

/**
 * action to handle signup events
 * @param {object} signupDetails
 * @returns {func} dispatch
 */
const signup = signupDetails => function (dispatch) {
  dispatch(showLoading());
  return axios.post(api.user.signUp, signupDetails)
    .then((response) => {
      /* eslint-disable no-undef */
      localStorage.setItem('jwtToken', response.data.token);
      setAuthorizationToken(response.data.token);
      dispatch(signupSuccess(response.data.user));
      dispatch(hideLoading());
    })
    .catch((error) => {
      dispatch(signupFailed(error.response.data.errors));
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

/**
 * action to handle signin event
 * @param {object} signinDetails
 * @returns {func} dispatch
 */
const signin = signinDetails => function (dispatch) {
  dispatch(showLoading());
  return axios.post(api.user.signin, signinDetails)
    .then((response) => {
      /* eslint-disable no-undef */
      localStorage.setItem('jwtToken', response.data.token);
      setAuthorizationToken(response.data.token);
      dispatch(signinSuccess(response.data.user));
      dispatch(getMenus());
      if (response.data.user.accountType !== 'customer') {
        dispatch(getMeals());
      }
      dispatch(hideLoading());
    })
    .catch((error) => {
      dispatch(signinFailed(error.response.data));
      dispatch(hideLoading());
    });
};

/**
 * action to handle successful signin
 * @param {object} user
 * @returns {object} reducer payload
 */
const signinSuccess = (user) => {
  toastr.success('', `Welcome, ${user.username}`);
  return {
    type: types.SIGNIN_SUCCESS,
    user,
  };
};

/**
 * action to handle failed signin
 * @param {object} data
 * @returns {object} reducer payload
 */
const signinFailed = (data) => {
  let errors = {};
  if (data.errors) {
    errors = getMessageValue(data.errors);
  } else if (data.message) {
    errors = {
      message: data.message,
    };
  }
  toastr.error('Signin Failed', data.message || 'An error occurred');
  return {
    type: types.SIGNIN_FAILED,
    errors,
  };
};

/**
 * action to handle logout
 * @returns {object} reducer payload
 */
const logout = () => {
  localStorage.removeItem('jwtToken');
  setAuthorizationToken(false);
  return {
    type: types.LOGOUT,
  };
};

export {
  signin,
  signup,
  signinSuccess,
  signinFailed,
  signupSuccess,
  signupFailed,
  logout,
};
