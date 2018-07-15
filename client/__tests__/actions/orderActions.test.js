import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { saveOrder } from '../../src/actions/orderActions';
import {
  saveOrderResponse,
  saveOrderFailedResponse, saveOrderFailedResponseB,
} from '../helpers/mockOrders';
import * as types from '../../src/actions/actionTypes';
import localStorage from '../helpers/mockLocalStorage';
import initialState from '../../src/reducers/initialState';
import api from '../../src/utils/api';
import { getMessageValue } from '../../src/utils/utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Test suite for Order Actions', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('should return proper action type and payload if save is successful', () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.SAVE_ORDER_SUCCESS,
      order: saveOrderResponse.order,
    };
    moxios.stubRequest(api.orders.post, {
      status: 201,
      response: saveOrderResponse,
    });
    const result = store.dispatch(saveOrder({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
      });
  });

  it('should return proper action type and payload if save is successful when updating', () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.SAVE_ORDER_SUCCESS,
      order: saveOrderResponse.order,
    };
    moxios.stubRequest(api.orders.put(1), {
      status: 200,
      response: saveOrderResponse,
    });
    const result = store.dispatch(saveOrder({ id: 1 }))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
      });
  });

  it('should return proper action type with error payload if save failed (error message type A)', (done) => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.SAVE_ORDER_FAILED,
      errors: getMessageValue(saveOrderFailedResponse.errors),
    };
    moxios.stubRequest(api.orders.post, {
      status: 400,
      response: saveOrderFailedResponse,
    });
    const result = store.dispatch(saveOrder({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
        done();
      });
  });

  it('should return proper action type with error payload if save failed (error message type B)', (done) => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.SAVE_ORDER_FAILED,
      errors: {
        message: saveOrderFailedResponseB.message,
      },
    };
    moxios.stubRequest(api.orders.post, {
      status: 400,
      response: saveOrderFailedResponseB,
    });
    const result = store.dispatch(saveOrder({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
        done();
      });
  });
});
