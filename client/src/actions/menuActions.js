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
      .then((response) => {
        dispatch(saveMenuSuccess(response.data));
        dispatch(hideLoading());
      })
      .catch((error) => {
        dispatch(saveMenuFailed(error.response.data));
        dispatch(hideLoading());
      });
  }
  return axios.put(api.menu.put(menuDetails.id), menuDetails)
    .then((response) => {
      dispatch(saveMenuSuccess(response.data));
      dispatch(hideLoading());
    })
    .catch((error) => {
      dispatch(saveMenuFailed(error.response.data));
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
    .then((response) => {
      dispatch(getMenusSuccess(response.data));
      dispatch(hideLoading());
    })
    .catch((error) => {
      dispatch(getMenusFailed(error.response.data));
      dispatch(hideLoading());
    });
};

/**
 * Action handle successful get menu request
 * @param {object} responseObject
 * @returns {object} action object
 */
const getMenusSuccess = responseObject => (
  {
    type: types.GET_MENU_SUCCESS,
    menus: responseObject.menus,
    pagination: responseObject.pagination,
  }
);

/**
 * action to handle failed menu get request
 * @param {object} errorObject
 * @return {object} action object
 */
const getMenusFailed = (errorObject) => {
  toastr.error('Error', errorObject.message || 'Could not get menus');
  return {
    type: types.GET_MENU_FAILED,
    errors: errorObject,
  };
};

/**
 * action to handle get menu for customer
 */
const getMenu = (limit = 10, offset = 0) => (dispatch) => {
  dispatch(showLoading());
  return axios.get(api.menu.get(limit, offset))
    .then((response) => {
      dispatch(getMenuSuccess(response.data));
      dispatch(hideLoading());
    })
    .catch((error) => {
      dispatch(getMenuFailed(error.response.data));
      dispatch(hideLoading());
    });
};

/**
 * Action handle successful get menu request for customer
 * @param {object} responseObject
 * @returns {object} action object
 */
const getMenuSuccess = responseObject => (
  {
    type: types.GET_CURR_MENU_SUCCESS,
    menu: responseObject.menu,
    pagination: responseObject.pagination,
  }
);

/**
 * action to handle get menu by id
 */
const getMenuById = (id, limit = 10, offset = 0) => (dispatch) => {
  dispatch(showLoading());
  return axios.get(api.menu.getById(id, limit, offset))
    .then((response) => {
      dispatch(getMenuByIdSuccess(response.data));
      dispatch(hideLoading());
    })
    .catch((error) => {
      dispatch(getMenuByIdFailed(error.response.data));
      dispatch(hideLoading());
    });
};

/**
 * Action handle successful get menu request
 * @param {object} responseObject
 * @returns {object} action object
 */
const getMenuByIdSuccess = responseObject => (
  {
    type: types.GET_SINGLE_MENU_SUCCESS,
    menu: responseObject.menu,
    pagination: responseObject.pagination,
  }
);

/**
 * action to handle failed menu get request
 * @param {object} errorObject
 * @return {object} action object
 */
const getMenuByIdFailed = (errorObject) => {
  toastr.error('Error', errorObject.message || 'Could not get menu');
  return {
    type: types.GET_SINGLE_MENU_FAILED,
    errors: errorObject,
  };
};

/**
 * action to handle failed menu get request for customer
 * @param {object} errorObject
 * @return {object} action object
 */
const getMenuFailed = (errorObject) => {
  toastr.warning('', errorObject.message || 'Could not get menus');
  return {
    type: types.GET_CURR_MENU_FAILED,
    errors: errorObject,
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
