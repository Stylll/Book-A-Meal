import initialState from './initialState';
import * as types from '../actions/actionTypes';

const menuReducer = (state = initialState.menus, action) => {
  switch (action.type) {
    case types.SAVE_MENU_SUCCESS:
      return {
        ...state,
        menus: [...state.menus.filter(m => m.id !== action.menu.id), action.menu],
        errors: {},
      };

    case types.SAVE_MENU_FAILED:
      return {
        ...state,
        errors: action.errors,
      };

    default:
      return state;
  }
};

export default menuReducer;