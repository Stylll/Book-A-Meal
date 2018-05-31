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
      .then((resp) => {
        dispatch(saveMealSuccess(resp.data));
        dispatch(hideLoading());
      })
      .catch((err) => {
        dispatch(saveMealFailed(err.response.data));
        dispatch(hideLoading());
      });
  }
  return axios.put(api.meals.put(mealDetails.id), formData)
    .then((resp) => {
      dispatch(saveMealSuccess(resp.data));
      dispatch(hideLoading());
    })
    .catch((err) => {
      dispatch(saveMealFailed(err.response.data));
      dispatch(hideLoading());
    });
};

/**
 * action to handle successful meal save
 * @param {object} responsedata
 * @returns {object} action object for reducer.
 */
const saveMealSuccess = (data) => {
  toastr.success('Saved', 'Meal successfully saved');
  return {
    type: types.SAVE_MEAL_SUCCESS,
    meal: data.meal,
  };
};

/**
 * action to handle failed meal save
 * @param {object} data
 * @returns {object} action object for reducer.
 */
const saveMealFailed = (data) => {
  let errors = {};
  if (data.errors) {
    errors = getMessageValue(data.errors);
  } else if (data.message) {
    errors = {
      message: data.message,
    };
  }
  toastr.error('Save Failed', data.message || 'An error occurred');
  return {
    type: types.SAVE_MEAL_FAILED,
    errors,
  };
};

/**
 * action to handle getting meals for a caterer.
 */
const getMeals = () => function (dispatch) {
  dispatch(showLoading());
  return axios.get(api.meals.get)
    .then((resp) => {
      dispatch(getMealsSuccess(resp.data));
      dispatch(hideLoading());
    })
    .catch((err) => {
      dispatch(getMealsFailed(err.response.data));
      dispatch(hideLoading());
    });
};

/**
 * action to handle successful meals get request
 * @param {object} data
 * @returns {object} action object for reducer
 */
const getMealsSuccess = data => ({
  type: types.GET_MEAL_SUCCESS,
  meals: data.meals,
});

/**
 * action to handle failed meals get request
 * @param {object} data
 * @returns {object} action object for reducer
 */
const getMealsFailed = (data) => {
  const errors = {
    message: data.message,
  };
  toastr.error('Unexpected Error', data.message || 'Could not get meals');
  return {
    type: types.GET_MEAL_FAILED,
    errors,
  };
};

export {
  saveMeal,
  saveMealSuccess,
  saveMealFailed,
  getMeals,
  getMealsSuccess,
  getMealsFailed,
};