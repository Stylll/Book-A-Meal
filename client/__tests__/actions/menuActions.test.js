import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { saveMenu, getMenus, getMenu, getMenuById } from '../../src/actions/menuActions';
import {
  saveMenuResponse,
  updateMenuResponse,
  saveMenuFailedResponse,
  saveMenuFailedResponseB,
  getMenuResponse,
  getMenuFailedResponse,
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
const pagination = {
  totalCount: 10,
  limit: 4,
  offset: 0,
  noPage: 3,
  pageNo: 1,
};

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

  describe('Test Suite for Menu Action GET', () => {
    beforeEach(() => moxios.install());
    afterEach(() => moxios.uninstall());

    it('should return proper action type and payload if get was successful', () => {
      const store = mockStore(initialState);
      const expectedAction = {
        type: types.GET_MENU_SUCCESS,
        menus: getMenuResponse.menus,
      };
      moxios.stubRequest(api.menu.get(), {
        status: 200,
        response: getMenuResponse,
      });
      store.dispatch(getMenus())
        .then(() => {
          const actions = store.getActions();
          expect(actions[1]).toEqual(expectedAction);
        });
    });

    it('should return proper action type and payload if get request failed', () => {
      const store = mockStore(initialState);
      const expectedAction = {
        type: types.GET_MENU_FAILED,
        errors: getMenuFailedResponse,
      };
      moxios.stubRequest(api.menu.get(), {
        status: 500,
        response: getMenuFailedResponse,
      });
      store.dispatch(getMenus())
        .then(() => {
          const actions = store.getActions();
          expect(actions[1].toEqual(expectedAction));
        });
    });
  });

  describe('Test suite for Menu action - GET CURRENT', () => {
    beforeEach(() => moxios.install());
    afterEach(() => moxios.uninstall());

    it('it should return proper status and payload if get request was successful', () => {
      const store = mockStore(initialState);
      const expectedAction = {
        type: types.GET_CURR_MENU_SUCCESS,
        menu: getMenuResponse.menus[0],
      };
      moxios.stubRequest(api.menu.get(), {
        status: 200,
        response: { menu: getMenuResponse.menus[0] },
      });
      store.dispatch(getMenu())
        .then(() => {
          const actions = store.getActions();
          expect(actions[1].toEqual(expectedAction));
        });
    });

    it('it should return error status and message if request failed', () => {
      const store = mockStore(initialState);
      const expectedAction = {
        type: types.GET_CURR_MENU_FAILED,
        errors: getMenuFailedResponse,
      };
      moxios.stubRequest(api.menu.get(), {
        status: 500,
        response: getMenuFailedResponse,
      });
      store.dispatch(getMenu())
        .then(() => {
          const actions = store.getActions();
          expect(actions[1].toEqual(expectedAction));
        });
    });
  });

  describe('Test suite for Menu action - GET MENU BY ID', () => {
    beforeEach(() => moxios.install());
    afterEach(() => moxios.uninstall());

    it('it should return proper status and payload if get menu by id request was successful', () => {
      const store = mockStore(initialState);
      const expectedAction = {
        type: types.GET_SINGLE_MENU_SUCCESS,
        menu: getMenuResponse.menus[0],
        pagination,
      };
      moxios.stubRequest(api.menu.getById(1), {
        status: 200,
        response: { menu: getMenuResponse.menus[0] },
      });
      store.dispatch(getMenuById(1))
        .then(() => {
          const actions = store.getActions();
          expect(actions[1].toEqual(expectedAction));
        });
    });

    it('it should return error status and message if get menu by id request failed', () => {
      const store = mockStore(initialState);
      const expectedAction = {
        type: types.GET_SINGLE_MENU_FAILED,
        errors: getMenuFailedResponse,
      };
      moxios.stubRequest(api.menu.getById(1), {
        status: 500,
        response: getMenuFailedResponse,
      });
      store.dispatch(getMenuById(1))
        .then(() => {
          const actions = store.getActions();
          expect(actions[1].toEqual(expectedAction));
        });
    });
  });
});
