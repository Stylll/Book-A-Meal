import axios from 'axios';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { toastr } from 'react-redux-toastr';
import * as types from './actionTypes';
import api from '../utils/api';
import { getMessageValue } from '../utils/utils';

/**
 * action to handle save order
 * @param {object} orderDetails
 * @returns {function} dispatch function.
 * it checks if order id exists, if it does, then
 * its an update operation. Else its a create operation.
 */
const saveOrder = orderDetails => (dispatch) => {
  dispatch(showLoading());
  if (!orderDetails.id) {
    return axios.post(api.orders.post, orderDetails)
      .then((response) => {
        dispatch(saveOrderSuccess(response.data));
        dispatch(hideLoading());
      })
      .catch((error) => {
        dispatch(saveOrderFailed(error.response.data));
        dispatch(hideLoading());
      });
  }
  return axios.put(api.orders.put(orderDetails.id), orderDetails)
    .then((response) => {
      dispatch(saveOrderSuccess(response.data));
      dispatch(hideLoading());
    })
    .catch((error) => {
      dispatch(saveOrderFailed(error.response.data));
      dispatch(hideLoading());
    });
};

/**
 * action to handle successful order save
 * @param {object} responsedata
 * @returns {object} action object for reducer.
 */
const saveOrderSuccess = (data) => {
  toastr.success('Saved', 'Order saved successfully');
  return {
    type: types.SAVE_ORDER_SUCCESS,
    order: data.order,
  };
};

/**
 * action to handle failed order save
 * @param {object} data
 * @returns {object} action object for reducer.
 */
const saveOrderFailed = (data) => {
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
    type: types.SAVE_ORDER_FAILED,
    errors,
  };
};

export {
  saveOrder,
  saveOrderSuccess,
  saveOrderFailed,
};
