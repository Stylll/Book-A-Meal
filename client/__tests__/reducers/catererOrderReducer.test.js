import orderReducer from '../../src/reducers/catererOrderReducer';
import initialState from '../../src/reducers/initialState';
import { signupSuccess, signupFailed, signinFailed, signinSuccess } from '../../src/actions/authActions';
import { validCaterer, validCustomer } from '../helpers/mockData';
import {
  saveOrder,
  saveOrderSuccess, saveOrderFailed,
  getOrders, getOrdersSuccess, getOrdersFailed,
  deleteOrder, deleteOrderSuccess, deleteOrderFailed,
  getOrderSummarySuccess, getOrderSummaryFailed,
} from '../../src/actions/orderActions';
import {
  SAVE_ORDER_SUCCESS, SAVE_ORDER_FAILED,
  GET_ORDERS_SUCCESS, GET_ORDERS_FAILED,
  DELETE_ORDER_SUCCESS, DELETE_ORDER_FAILED,
  LOGOUT,
} from '../../src/actions/actionTypes';
import {
  saveOrderResponse,
  saveOrderFailedResponse, saveOrderFailedResponseB,
  getOrdersResponse, getOrdersFailedResponse,
  deleteOrderResponse, deleteOrderFailedResponse, deleteOrderFailedResponseB,
  getOrderSummaryResponse, getOrderSummaryFailedResponse,
} from '../helpers/mockOrders';

describe('Test Suite for Order Reducer for caterer - SAVE', () => {
  it('should update state with order if save request was successful', () => {
    const action = saveOrderSuccess(saveOrderResponse);
    initialState.orders.isCaterer = true;
    const state = orderReducer(initialState.orders, action);
    const newState = state.catererOrders;
    expect(newState.orders.length).toBe(1);
    expect(newState.orders[0].id).toBe(saveOrderResponse.order.id);
    expect(newState.orders[0].mealId).toBe(saveOrderResponse.order.mealId);
  });

  it('should update state with errors if save request failed', () => {
    initialState.orders.isCaterer = true;
    const action = saveOrderFailed(saveOrderFailedResponse);
    const state = orderReducer(initialState.orders, action);
    const newState = state.catererOrders;
    expect(newState.orders.length).toBe(0);
    expect(newState.errors.menu).toBe(saveOrderFailedResponse.errors.menu.message);
    expect(newState.errors.meal).toBe(saveOrderFailedResponse.errors.meal.message);
  });

  it('should not update state if action type is invalid', () => {
    initialState.orders.isCaterer = true;
    const action = {
      type: null,
    };
    const newState = orderReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});

describe('Test Suite for order reducer for caterer - GET', () => {
  it('should update state with orders if get request is successful', () => {
    initialState.orders.isCaterer = true;
    const action = getOrdersSuccess(getOrdersResponse);
    const state = orderReducer(initialState.orders, action);
    const newState = state.catererOrders;
    expect(newState.orders.length).toBe(4);
    expect(newState.orders[0]).toEqual(getOrdersResponse.orders[0]);
  });

  it('should update state with errors if get request failed', () => {
    initialState.orders.isCaterer = true;
    const action = getOrdersFailed(getOrdersFailedResponse);
    const state = orderReducer(initialState.orders, action);
    const newState = state.catererOrders;
    expect(newState.errors.message).toBe(getOrdersFailedResponse.message);
  });
});

describe('Test Suite for order reducer for caterer - DELETE', () => {
  it('should remove order from state if delete request is successful', () => {
    initialState.orders.isCaterer = true;
    initialState.orders.catererOrders.orders = [];
    initialState.orders.catererOrders.orders.push(saveOrderResponse.order);
    const action = deleteOrderSuccess(saveOrderResponse.order.id);
    const state = orderReducer(initialState.orders, action);
    const newState = state.catererOrders;
    expect(newState.orders.length).toBe(0);
  });

  it('should not update state if delete request failed', () => {
    initialState.orders.isCaterer = true;
    const action = deleteOrderFailed(deleteOrderFailedResponse);
    const state = orderReducer(initialState.orders, action);
    const newState = state.catererOrders;
    expect(newState.orders.length).toBe(1);
  });

  it('should set isCaterer to true if a caterer logs in', () => {
    const action = signinSuccess(validCaterer);
    const newState = orderReducer(initialState.orders, action);
    expect(newState.isCaterer).toBe(true);
    expect(newState.isCustomer).toBe(false);
  });
});

describe('Test Suite for order reducer for caterer - GET SUMMARY', () => {
  it('should update state with order summary if get summary request is successful', () => {
    initialState.orders.isCaterer = true;
    const action = getOrderSummarySuccess(getOrderSummaryResponse);
    const state = orderReducer(initialState.orders, action);
    const newState = state.catererOrders;
    expect(newState.summary.length).toBe(2);
    expect(newState.summary[0]).toEqual(getOrderSummaryResponse.orders[0]);
  });

  it('should not update state if get summary request failed', () => {
    initialState.orders.isCaterer = true;
    const action = getOrderSummaryFailed(getOrderSummaryFailedResponse);
    const state = orderReducer(initialState.orders, action);
    const newState = state.catererOrders;
    expect(newState).toEqual(initialState.orders.catererOrders);
  });
});
