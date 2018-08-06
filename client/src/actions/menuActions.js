import axios from 'axios';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { toastr } from 'react-redux-toastr';
import * as types from './actionTypes';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import api from '../utils/api';
import { getMessageValue } from '../utils/utils';

/**
 * action to handle save meal requests
 * @param {object} menuDetails
 * @returns {func} dispatch function.
 * it checks if menu id exists, if it does, then
 * its an update operation. Else its a create operation.
 */
const saveMenu = menuDetails => function (dispatch) {
  dispatch(showLoading());
  if (!menuDetails.id) {
    return axios.post(api.menu.post, menuDetails)
      .then((resp) => {
        dispatch(saveMenuSuccess(resp.data));
        dispatch(hideLoading());
      })
      .catch((err) => {
        dispatch(saveMenuFailed(err.response.data));
        dispatch(hideLoading());
      });
  }
  return axios.put(api.menu.put(menuDetails.id), menuDetails)
    .then((resp) => {
      dispatch(saveMenuSuccess(resp.data));
      dispatch(hideLoading());
    })
    .catch((err) => {
      dispatch(saveMenuFailed(err.response.data));
      dispatch(hideLoading());
    });
};

/**
 * action handle successful save menu request
 * @param {object} responseData
 * @returns {object} action object for reducer
 */
const saveMenuSuccess = (responseData) => {
  toastr.success('Saved', 'Menu successfully saved');
  return {
    type: types.SAVE_MENU_SUCCESS,
    menu: responseData.menu,
  };
};

/**
 * action to handle failed save menu request
 * @param {object} errorData
 * @returns {object} action object for reducer
 */
const saveMenuFailed = (errorData) => {
  toastr.error('Save Failed', errorData.message || 'An error occurred');
  let errors = {};
  if (errorData.errors) {
    errors = getMessageValue(errorData.errors);
  } else if (errorData.message) {
    errors = {
      message: errorData.message,
    };
  }
  return {
    type: types.SAVE_MENU_FAILED,
    errors,
  };
};

/**
 * action to handle get menus for caterer
 */
const getMenus = (limit = 10, offset = 0) => (dispatch) => {
  dispatch(showLoading());
  return axios.get(api.menu.get(limit, offset))
    .then((resp) => {
      dispatch(getMenusSuccess(resp.data));
      dispatch(hideLoading());
    })
    .catch((err) => {
      dispatch(getMenusFailed(err.response.data));
      dispatch(hideLoading());
    });
};

/**
 * Action handle successful get menu request
 * @param {object} data
 * @returns {object} action object
 */
const getMenusSuccess = data => (
  {
    type: types.GET_MENU_SUCCESS,
    menus: data.menus,
    pagination: data.pagination,
  }
);

/**
 * action to handle failed menu get request
 * @param {object} data
 * @return {object} action object
 */
const getMenusFailed = (data) => {
  toastr.error('Error', data.message || 'Could not get menus');
  return {
    type: types.GET_MENU_FAILED,
    errors: data,
  };
};

/**
 * action to handle get menu for customer
 */
const getMenu = (limit = 10, offset = 0) => (dispatch) => {
  dispatch(showLoading());
  return axios.get(api.menu.get(limit, offset))
    .then((resp) => {
      dispatch(getMenuSuccess(resp.data));
      dispatch(hideLoading());
    })
    .catch((err) => {
      dispatch(getMenuFailed(err.response.data));
      dispatch(hideLoading());
    });
};

/**
 * Action handle successful get menu request for customer
 * @param {object} data
 * @returns {object} action object
 */
const getMenuSuccess = data => (
  {
    type: types.GET_CURR_MENU_SUCCESS,
    menu: data.menu,
    pagination: data.pagination,
  }
);

/**
 * action to handle get menu by id
 */
const getMenuById = (id, limit = 10, offset = 0) => (dispatch) => {
  dispatch(showLoading());
  return axios.get(api.menu.getById(id, limit, offset))
    .then((resp) => {
      dispatch(getMenuByIdSuccess(resp.data));
      dispatch(hideLoading());
    })
    .catch((err) => {
      dispatch(getMenuByIdFailed(err.response.data));
      dispatch(hideLoading());
    });
};

/**
 * Action handle successful get menu request
 * @param {object} data
 * @returns {object} action object
 */
const getMenuByIdSuccess = data => (
  {
    type: types.GET_SINGLE_MENU_SUCCESS,
    menu: data.menu,
    pagination: data.pagination,
  }
);

/**
 * action to handle failed menu get request
 * @param {object} data
 * @return {object} action object
 */
const getMenuByIdFailed = (data) => {
  toastr.error('Error', data.message || 'Could not get menu');
  return {
    type: types.GET_SINGLE_MENU_FAILED,
    errors: data,
  };
};

/**
 * action to handle failed menu get request for customer
 * @param {object} data
 * @return {object} action object
 */
const getMenuFailed = (data) => {
  toastr.warning('', data.message || 'Could not get menus');
  return {
    type: types.GET_CURR_MENU_FAILED,
    errors: data,
  };
};

export {
  saveMenu,
  saveMenuSuccess,
  saveMenuFailed,
  getMenus,
  getMenusSuccess,
  getMenusFailed,
  getMenu,
  getMenuSuccess,
  getMenuFailed,
  getMenuById,
  getMenuByIdSuccess,
  getMenuByIdFailed,
};
