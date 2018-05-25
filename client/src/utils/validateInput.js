import { isEmpty, trim } from 'lodash';
import validator from 'validator';

/**
 * method to validate signup input
 * @param {object} state
 * @returns {object} {errors, isValid}
 */

const validateSignupInput = (state) => {
  const errors = {};

  // check email
  if (!state.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(state.email.trim())) {
    errors.email = 'Email is invalid';
  }

  // check username
  if (!state.username.trim()) {
    errors.username = 'Username is required';
  } else if (/[^A-Za-z0-9_-]/gi.test(state.username.trim())) {
    errors.username = 'Only A-Z a-z 0-9 _ - characters are allowed';
  }

  // check password
  if (!state.password.trim()) {
    errors.password = 'Password is required';
  } else if (state.password.length < 6) {
    errors.password = 'Password must have atleast 6 characters';
  } else if (state.password.trim() !== state.confirmPassword.trim()) {
    errors.password = 'Passwords dont match';
    errors.confirmPassword = 'Passwords dont match';
  }

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

/**
 * method to validate signin input
 * @param {object} state
 * @returns {object} {errors, isValid}
 */

const validateSigninInput = (state) => {
  const errors = {};
  if (!state.email || !state.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(state.email.trim())) {
    errors.email = 'Email is invalid';
  }

  if (!state.password || !state.password.trim()) {
    errors.password = 'Password is required';
  }

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

export { validateSignupInput, validateSigninInput };