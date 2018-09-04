import axios from 'axios';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { toastr } from 'react-redux-toastr';
import * as types from './actionTypes';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import api from '../utils/api';
import { getMessageValue } from '../utils/utils';

/**
 * action to handle save meals
 * @param {object} mealDetails
 * @returns {function} dispatch function.
 * it checks if meal id exists, if it does, then
 * its an update operation. Else its a create operation.
 */
const saveMeal = mealDetails => function (dispatch) {
  dispatch(showLoading());
  /* eslint-disable no-undef */
  const formData = new FormData();
  formData.append('name', mealDetails.name);
  formData.append('price', mealDetails.price);
  if (mealDetails.imageUpload) {
    formData.append('image', mealDetails.imageUpload, mealDetails.imageUpload.name);
  }
  if (!mealDetails.id) {
    return axios.post(api.meals.post, formData)
      .then((response) => {
        dispatch(saveMealSuccess(response.data));
        dispatch(hideLoading());
      })
      .catch((error) => {
        dispatch(saveMealFailed(error.response.data));
        dispatch(hideLoading());
      });
  }
  return axios.put(api.meals.put(mealDetails.id), formData)
    .then((response) => {
      dispatch(saveMealSuccess(response.data));
      dispatch(hideLoading());
    })
    .catch((error) => {
      dispatch(saveMealFailed(error.response.data));
      dispatch(hideLoading());
    });
};

/**
 * action to handle successful meal save
 * @param {object} responseObject
 * @returns {object} action object for reducer.
 */
const saveMealSuccess = (responseObject) => {
  toastr.success('Saved', 'Meal successfully saved');
  return {
    type: types.SAVE_MEAL_SUCCESS,
    meal: responseObject.meal,
  };
};

/**
 * action to handle failed meal save
 * @param {object} errorObject
 * @returns {object} action object for reducer.
 */
const saveMealFailed = (errorObject) => {
  let errors = {};
  if (errorObject.errors) {
    errors = getMessageValue(errorObject.errors);
  } else if (errorObject.message) {
    errors = {
      message: errorObject.message,
    };
  }
  toastr.error('Save Failed', errorObject.message || 'An error occurred');
  return {
    type: types.SAVE_MEAL_FAILED,
    errors,
  };
};

/**
 * action to handle getting meals for a caterer.
 */
const getMeals = (limit = 10, offset = 0, mealName = '') => function (dispatch) {
  dispatch(showLoading());
  return axios.get(api.meals.get(limit, offset, mealName))
    .then((response) => {
      dispatch(getMealsSuccess(response.data));
      dispatch(hideLoading());
    })
    .catch((error) => {
      dispatch(getMealsFailed(error.response.data));
      dispatch(hideLoading());
    });
};

/**
 * action to handle successful meals get request
 * @param {object} responseObject
 * @returns {object} action object for reducer
 */
const getMealsSuccess = responseObject => ({
  type: types.GET_MEAL_SUCCESS,
  meals: responseObject.meals,
  pagination: responseObject.pagination,
});

/**
 * action to handle failed meals get request
 * @param {object} errorObject
 * @returns {object} action object for reducer
 */
const getMealsFailed = (errorObject) => {
  const errors = {
    message: errorObject.message,
  };
  toastr.error('Unexpected Error', errorObject.message || 'Could not get meals');
  return {
    type: types.GET_MEAL_FAILED,
    errors,
  };
};

/**
 * action to handle deleting meals for a caterer.
 * @param {integer} mealId
 */
const deleteMeal = mealId => function (dispatch) {
  dispatch(showLoading());
  return axios.delete(api.meals.delete(mealId))
    .then((response) => {
      dispatch(deleteMealSuccess(mealId));
      dispatch(hideLoading());
    })
    .catch((error) => {
      dispatch(deleteMealFailed(error.response.data));
      dispatch(hideLoading());
    });
};

/**
 * action to handle successful meal delete request
 * @param {integer} mealId
 * @returns {object} action object for reducer
 */
const deleteMealSuccess = (mealId) => {
  toastr.success('Meal deleted successfully');
  return {
    type: types.DELETE_MEAL_SUCCESS,
    mealId,
  };
};

/**
 * action to handle failed meal delete request
 * @param {object} errorObject
 */
const deleteMealFailed = (errorObject) => {
  let errors = {};
  if (errorObject.errors) {
    errors = getMessageValue(errorObject.errors);
  } else if (errorObject.message) {
    errors = {
      message: errorObject.message,
    };
  }
  toastr.error('Error', errors.meal || errorObject.message || 'Could not delete meal');
  return {
    type: types.DELETE_MEAL_FAILED,
  };
};

export {
  saveMeal,
  saveMealSuccess,
  saveMealFailed,
  getMeals,
  getMealsSuccess,
  getMealsFailed,
  deleteMeal,
  deleteMealSuccess,
  deleteMealFailed,
};
