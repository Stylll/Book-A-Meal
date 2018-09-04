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
 * @param {object} responseObject
 * @returns {object} action object for reducer.
 */
const saveOrderSuccess = (responseObject) => {
  toastr.success('Saved', 'Order saved successfully');
  return {
    type: types.SAVE_ORDER_SUCCESS,
    order: responseObject.order,
  };
};

/**
 * action to handle failed order save
 * @param {object} errorObject
 * @returns {object} action object for reducer.
 */
const saveOrderFailed = (errorObject) => {
  let errors = {};
  if (errorObject.errors) {
    errors = getMessageValue(errorObject.errors);
  } else if (errorObject.message) {
    errors = {
      message: errorObject.message,
    };
  }
  toastr.error('Save Failed', errorObject.message
  || 'Sorry. You no longer have the permission to make changes to this order.');
  return {
    type: types.SAVE_ORDER_FAILED,
    errors,
  };
};

/**
 * action to retrieve customer orders from the server
 * @returns dispatch function
 */
const getOrders = (limit = 10, offset = 0, status = '') => (dispatch) => {
  dispatch(showLoading());
  return axios.get(api.orders.get(limit, offset, status))
    .then((response) => {
      dispatch(getOrdersSuccess(response.data));
      dispatch(hideLoading());
    })
    .catch((error) => {
      dispatch(getOrdersFailed(error.response.data));
      dispatch(hideLoading());
    });
};

/**
 * action to handle successful orders get request
 * @param {object} responseObject
 * @returns {object} action object for reducer
 */
const getOrdersSuccess = responseObject => ({
  type: types.GET_ORDERS_SUCCESS,
  orders: responseObject.orders,
  pagination: responseObject.pagination,
});

/**
 * action to handle failed orders get request
 * @param {object} errorObject
 * @returns {object} action object for reducer
 */
const getOrdersFailed = (errorObject) => {
  const errors = {
    message: errorObject.message,
  };
  toastr.error('Unexpected Error', errorObject.message || 'Could not get orders');
  return {
    type: types.GET_ORDERS_FAILED,
    errors,
  };
};

/**
 * action to delete customers order
 * @param {integer} orderId
 * @returns dispatch function
 */
const deleteOrder = orderId => (dispatch) => {
  dispatch(showLoading());
  return axios.delete(api.orders.delete(orderId))
    .then((response) => {
      dispatch(deleteOrderSuccess(orderId));
      dispatch(hideLoading());
    })
    .catch((error) => {
      dispatch(deleteOrderFailed(error.response.data));
      dispatch(hideLoading());
    });
};

/**
 * action to handle successful order delete request
 * @param {integer} orderId
 * @returns {object} action object for reducer
 */
const deleteOrderSuccess = (orderId) => {
  toastr.success('Delete', 'Order deleted successfully');
  return {
    type: types.DELETE_ORDER_SUCCESS,
    orderId,
  };
};

/**
 * action to handle failed order delete request
 * @param {object} errorObject
 * @returns {object} action object for reducer
 */
const deleteOrderFailed = (errorObject) => {
  let errors = {};
  if (errorObject.errors) {
    errors = getMessageValue(errorObject.errors);
  } else if (errorObject.message) {
    errors = {
      message: errorObject.message,
    };
    toastr.error('Unexpected Error', errorObject.message || 'Could not delete order');
  }
  return {
    type: types.DELETE_ORDER_FAILED,
  };
};

/**
 * action to retrieve customer orders summary from the server
 * @returns dispatch function
 */
const getOrderSummary = (limit, offset) => (dispatch) => {
  dispatch(showLoading());
  return axios.get(api.orders.summary(limit, offset))
    .then((response) => {
      dispatch(getOrderSummarySuccess(response.data));
      dispatch(hideLoading());
    })
    .catch((error) => {
      dispatch(getOrderSummaryFailed(error.response.data));
      dispatch(hideLoading());
    });
};

/**
 * action to handle successful orders summary get request
 * @param {object} responseObject
 * @returns {object} action object for reducer
 */
const getOrderSummarySuccess = responseObject => ({
  type: types.GET_ORDER_SUMMARY_SUCCESS,
  summary: responseObject.orders,
  pagination: responseObject.pagination,
});

/**
 * action to handle failed orders summary get request
 * @param {object} errorObject
 * @returns {object} action object for reducer
 */
const getOrderSummaryFailed = (errorObject) => {
  const errors = {
    message: errorObject.message,
  };
  toastr.error('Unexpected Error', errorObject.message || 'Could not get orders');
  return {
    type: types.GET_ORDER_SUMMARY_FAILED,
    errors,
  };
};


export {
  saveOrder,
  saveOrderSuccess,
  saveOrderFailed,
  getOrders,
  getOrdersSuccess,
  getOrdersFailed,
  deleteOrder,
  deleteOrderSuccess,
  deleteOrderFailed,
  getOrderSummary,
  getOrderSummarySuccess,
  getOrderSummaryFailed,
};
