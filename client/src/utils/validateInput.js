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

/**
 * method to valid create meal input
 * @param {object} state
 * @returns {object} error object
 */
const validateMealInput = (state) => {
  const errors = {};
  if (!state.name || !state.name.trim()) {
    errors.name = 'Meal name is required';
  } else if (state.name.trim().length > 50) {
    errors.name = 'Meal name should not be more than 50 characters';
  } else if (/[^A-Za-z0-9 ]/gi.test(state.name.trim())) {
    errors.name = 'Meal name can only contain alphanumeric characters';
  }

  if (!state.price || !state.price.trim()) {
    errors.price = 'Price is required';
  } else if (/[^0-9.]/gi.test(state.price.trim())) {
    errors.price = 'Price is invalid';
  } else if (parseFloat(state.price.trim()) <= 1) {
    errors.price = 'Price must be greater than 1';
  }

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

const validateMenuInput = (state) => {
  const errors = {};
  if (isEmpty(state.mealIds)) {
    errors.mealIds = 'Please select atleast one meal';
  } else if (/[^0-9]/gi.test(state.mealIds.join(''))) {
    errors.mealIds = 'One or more of the meal options are invalid';
  }

  return {
    isValid: isEmpty(errors),
    errors,
  };
};

export { validateSignupInput, validateSigninInput, validateMealInput, validateMenuInput };