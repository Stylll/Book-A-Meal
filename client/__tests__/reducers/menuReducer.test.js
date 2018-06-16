import menuReducer from '../../src/reducers/menuReducer';
import initialState from '../../src/reducers/initialState';
import {
  saveMenu,
  saveMenuSuccess, saveMenuFailed,
} from '../../src/actions/menuActions';
import { SAVE_MENU_SUCCESS, SAVE_MENU_FAILED } from '../../src/actions/actionTypes';
import {
  saveMenuResponse,
  saveMenuFailedResponse, saveMenuFailedResponseB,
} from '../helpers/mockMenu';

describe('Test Suite for Menu Reducer - SAVE', () => {
  it('should update state with menu if save was successful', () => {
    const action = saveMenuSuccess(saveMenuResponse);
    const newState = menuReducer(initialState.menus, action);
    expect(newState.menus.length).toBeGreaterThan(0);
    expect(newState.menus[0].name).toBe(saveMenuResponse.menu.name);
    expect(newState.menus[0].date).toBe(saveMenuResponse.menu.date);
  });

  it('should update state with errors if save failed', () => {
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