import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { saveMenu } from '../../src/actions/menuActions';
import {
  saveMenuResponse,
  updateMenuResponse,
  saveMenuFailedResponse,
  saveMenuFailedResponseB,
} from '../helpers/mockMenu';
import * as types from '../../src/actions/actionTypes';
import localStorage from '../helpers/mockLocalStorage';
import initialState from '../../src/reducers/initialState';
import api from '../../src/utils/api';
import { getMessageValue } from '../../src/utils/utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
/* eslint-disable no-undef */
window.localStorage = localStorage;

describe('Test Suite for Menu Action', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('should return success action type and payload if save is successful', () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.SAVE_MENU_SUCCESS,
      menu: saveMenuResponse.menu,
    };
    moxios.stubRequest(api.menu.post, {
      status: 201,
      response: saveMenuResponse,
    });
    const result = store.dispatch(saveMenu({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
      });
  });

  it('should return failed action type and error object if save failed', () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.SAVE_MENU_FAILED,
      errors: getMessageValue(saveMenuFailedResponse.errors),
    };
    moxios.stubRequest(api.menu.post, {
      status: 400,
      response: saveMenuFailedResponse,
    });
    const result = store.dispatch(saveMenu({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
      });
  });

  it('should return success action type and payload if update is successful', () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.SAVE_MENU_SUCCESS,
      menu: updateMenuResponse.menu,
    };
    moxios.stubRequest(api.menu.put(1), {
      status: 200,
      response: updateMenuResponse,
    });
    const result = store.dispatch(saveMenu({ id: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
      });
  });

  it('should return failed action type and error object if update failed', () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.SAVE_MENU_FAILED,
      errors: { message: saveMenuFailedResponseB.message },
    };
    moxios.stubRequest(api.menu.put(1), {
      status: 400,
      response: saveMenuFailedResponseB,
    });
    const result = store.dispatch(saveMenu({ id: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
      });
  });
});