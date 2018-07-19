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
        // add the meal object to the order object so it can be saved in the state.
        response.data.order = {
          ...response.data.order,
          meal: orderDetails.meal,
        };
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
      // add the meal object to the order object so it can be saved in the state.
      response.data.order = {
        ...response.data.order,
        meal: orderDetails.meal,
      };
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
  toastr.error('Save Failed', data.message || 'Sorry. You no longer have the permission to make changes to this order.');
  return {
    type: types.SAVE_ORDER_FAILED,
    errors,
  };
};

/**
 * action to retrieve customer orders from the server
 * @returns dispatch function
 */
const getOrders = () => (dispatch) => {
  dispatch(showLoading());
  return axios.get(api.orders.get)
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
 * @param {object} data
 * @returns {object} action object for reducer
 */
const getOrdersSuccess = data => ({
  type: types.GET_ORDERS_SUCCESS,
  orders: data.orders,
});

/**
 * action to handle failed orders get request
 * @param {object} data
 * @returns {object} action object for reducer
 */
const getOrdersFailed = (data) => {
  const errors = {
    message: data.message,
  };
  toastr.error('Unexpected Error', data.message || 'Could not get orders');
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
 * @param {object} data
 * @returns {object} action object for reducer
 */
const deleteOrderFailed = (data) => {
  let errors = {};
  if (data.errors) {
    errors = getMessageValue(data.errors);
  } else if (data.message) {
    errors = {
      message: data.message,
    };
    toastr.error('Unexpected Error', data.message || 'Could not delete order');
  }
  return {
    type: types.DELETE_ORDER_FAILED,
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
};
