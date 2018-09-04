import menuReducer from '../../src/reducers/menuReducer';
import initialState from '../../src/reducers/initialState';
import {
  saveMenu,
  saveMenuSuccess, saveMenuFailed,
  getMenus, getMenusSuccess, getMenusFailed,
  getMenu, getMenuSuccess, getMenuFailed,
  getMenuByIdSuccess, getMenuByIdFailed,
} from '../../src/actions/menuActions';
import {
  SAVE_MENU_SUCCESS, SAVE_MENU_FAILED,
  GET_MENU_SUCCESS, GET_MENU_FAILED,
  GET_CURR_MENU_SUCCESS, GET_CURR_MENU_FAILED,
} from '../../src/actions/actionTypes';
import {
  saveMenuResponse,
  saveMenuFailedResponse, saveMenuFailedResponseB,
  getMenuResponse, getMenuFailedResponse, getSingleMenuResponse,
} from '../helpers/mockMenu';

describe('Test Suite for Menu Reducer - SAVE', () => {
  it('should update state with menu if save request was successful', () => {
    const action = saveMenuSuccess(saveMenuResponse);
    const newState = menuReducer(initialState.menus, action);
    expect(newState.menus.length).toBeGreaterThan(0);
    expect(newState.menus[0].name).toBe(saveMenuResponse.menu.name);
    expect(newState.menus[0].date).toBe(saveMenuResponse.menu.date);
  });

  it('should update state with errors if save request fails', () => {
    const action = saveMenuFailed(saveMenuFailedResponse);
    const newState = menuReducer(initialState.menus, action);
    expect(newState.menus.length).toBe(0);
    expect(newState.errors.menu).toBe(saveMenuFailedResponse.errors.menu.message);
  });

  it('should not update state if action type is invalid', () => {
    const action = {
      type: null,
    };
    const newState = menuReducer(initialState.menus, action);
    expect(newState).toEqual(initialState.menus);
  });
});

describe('Test Suite for Menu Reducer - GET', () => {
  it('should update the state with menu if get request was successful', () => {
    const action = getMenusSuccess(getMenuResponse);
    const newState = menuReducer(initialState.menu, action);
    expect(newState.menus.length).toBe(2);
  });

  it('should not update the state if get request fails', () => {
    const action = getMenusFailed(getMenuFailedResponse);
    const newState = menuReducer(initialState.menu, action);
    expect(newState).toEqual(initialState.menus);
  });
});

describe('Test suite for Menu Reducer - GET CURRENT MENU', () => {
  it('should update state with menu if get current menu request was successful', () => {
    const action = getMenuSuccess({ menu: getMenuResponse.menus[0] });
    const newState = menuReducer(initialState.menu, action);
    expect(newState.currentMenu).toEqual(getMenuResponse.menus[0]);
  });

  it('should not update state if get current menu request failed', () => {
    const action = getMenuFailed(getMenuFailedResponse);
    const newState = menuReducer(initialState.menu, action);
    expect(newState).toEqual(initialState.menus);
  });
});

describe('Test suite for Menu Reducer - GET SINGLE MENU', () => {
  it('should update state with menu if get single request was successful', () => {
    const action = getMenuByIdSuccess(getSingleMenuResponse);
    const newState = menuReducer(initialState.menu, action);
    expect(newState.menu).toEqual(getSingleMenuResponse.menu);
  });

  it('should not update state if get single request failed', () => {
    const action = getMenuByIdFailed({ message: 'Error occurred' });
    const newState = menuReducer(initialState.menu, action);
    expect(newState).toEqual(initialState.menus);
  });
});
