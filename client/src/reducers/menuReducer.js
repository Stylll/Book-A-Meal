import initialState from './initialState';
import * as types from '../actions/actionTypes';

const menuReducer = (state = initialState.menus, action) => {
  switch (action.type) {
    case types.SAVE_MENU_SUCCESS:
      return {
        ...state,
        menus: [action.menu, ...state.menus.filter(m => m.id !== action.menu.id)],
        errors: {},
      };

    case types.SAVE_MENU_FAILED:
      return {
        ...state,
        errors: action.errors,
      };

    case types.GET_MENU_SUCCESS:
      return {
        ...state,
        menus: action.menus,
      };

    case types.LOGOUT:
      return {
        ...state,
        menus: [],
        errors: {},
      };

    default:
      return state;
  }
};

export default menuReducer;