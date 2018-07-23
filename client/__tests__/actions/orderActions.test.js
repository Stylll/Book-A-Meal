import moxios from 'moxios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { saveOrder, getOrders, deleteOrder, getOrderSummary } from '../../src/actions/orderActions';
import {
  saveOrderResponse,
  saveOrderFailedResponse, saveOrderFailedResponseB,
  getOrdersResponse, getOrdersFailedResponse,
  deleteOrderResponse, deleteOrderFailedResponse, deleteOrderFailedResponseB,
  getOrderSummaryResponse, getOrderSummaryFailedResponse,
} from '../helpers/mockOrders';
import * as types from '../../src/actions/actionTypes';
import localStorage from '../helpers/mockLocalStorage';
import initialState from '../../src/reducers/initialState';
import api from '../../src/utils/api';
import { getMessageValue } from '../../src/utils/utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Test suite for Order Actions - SAVE', () => {
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

describe('Test Suite for Order Actions - GET', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('should return proper action type and payload if get request is successful', () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.GET_ORDERS_SUCCESS,
      orders: getOrdersResponse.orders,
    };
    moxios.stubRequest(api.orders.get, {
      status: 200,
      response: getOrdersResponse,
    });
    const result = store.dispatch(getOrders({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
      });
  });

  it('should return proper action type and payload if get request failed', () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.GET_ORDERS_SUCCESS,
      errors: { message: getOrdersFailedResponse.message },
    };
    moxios.stubRequest(api.orders.get, {
      status: 500,
      response: getOrdersFailedResponse,
    });
    const result = store.dispatch(getOrders({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
      });
  });
});

describe('Test Suite for Order Actions - DELETE', () => {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it('should return proper action type and payload if delete is successful', () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.DELETE_ORDER_SUCCESS,
      orderId: saveOrderResponse.order.id,
    };
    moxios.stubRequest(api.orders.delete(saveOrderResponse.order.id), {
      status: 200,
      response: deleteOrderResponse,
    });
    const result = store.dispatch(deleteOrder({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
      });
  });

  it('should return proper action type and error payload if delete failed: Type A', () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.DELETE_ORDER_FAILED,
    };
    moxios.stubRequest(api.orders.delete(saveOrderResponse.order.id), {
      status: 401,
      response: deleteOrderFailedResponse,
    });
    const result = store.dispatch(deleteOrder(saveOrderResponse.order.id))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
      });
  });

  it('should return proper action type and error payload if delete failed: Type B', () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.DELETE_ORDER_FAILED,
    };
    moxios.stubRequest(api.orders.delete(saveOrderResponse.order.id), {
      status: 404,
      response: deleteOrderFailedResponseB,
    });
    const result = store.dispatch(deleteOrder(saveOrderResponse.order.id))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
      });
  });
});

describe('Test Suite for Order Actions - GET SUMMARY', () => {
  it('should return proper payload and action type if request is successful', () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.GET_ORDER_SUMMARY_SUCCESS,
      summary: getOrderSummaryResponse.orders,
    };
    moxios.stubRequest(api.orders.summary, {
      status: 200,
      response: getOrderSummaryResponse,
    });
    const result = store.dispatch(getOrderSummary({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
      });
  });

  it('should return proper payload and action type if request failed', () => {
    const store = mockStore(initialState);
    const expectedAction = {
      type: types.GET_ORDER_SUMMARY_FAILED,
      errors: { message: getOrderSummaryFailedResponse.message },
    };
    moxios.stubRequest(api.orders.summary, {
      status: 401,
      response: getOrderSummaryFailedResponse,
    });
    const result = store.dispatch(getOrderSummary({}))
      .then(() => {
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
      });
  });
});
