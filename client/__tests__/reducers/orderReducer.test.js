import orderReducer from '../../src/reducers/orderReducer';
import initialState from '../../src/reducers/initialState';
import { signupSuccess, signupFailed, signinFailed, signinSuccess } from '../../src/actions/authActions';
import { validCaterer, validCustomer } from '../helpers/mockData';
import {
  saveOrder,
  saveOrderSuccess, saveOrderFailed,
  getOrders, getOrdersSuccess, getOrdersFailed,
  deleteOrder, deleteOrderSuccess, deleteOrderFailed,
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
} from '../helpers/mockOrders';

describe('Test Suite for Order Reducer for customer - SAVE', () => {
  it('should update state with order if save was successful', () => {
    const action = saveOrderSuccess(saveOrderResponse);
    initialState.orders.isCustomer = true;
    const state = orderReducer(initialState.orders, action);
    const newState = state.customerOrders;
    expect(newState.orders.length).toBe(1);
    expect(newState.orders[0].id).toBe(saveOrderResponse.order.id);
    expect(newState.orders[0].mealId).toBe(saveOrderResponse.order.mealId);
  });

  it('should update state with errors if save failed', () => {
    initialState.orders.isCustomer = true;
    const action = saveOrderFailed(saveOrderFailedResponse);
    const state = orderReducer(initialState.orders, action);
    const newState = state.customerOrders;
    expect(newState.orders.length).toBe(0);
    expect(newState.errors.menu).toBe(saveOrderFailedResponse.errors.menu.message);
    expect(newState.errors.meal).toBe(saveOrderFailedResponse.errors.meal.message);
  });

  it('should not update state if action type is invalid', () => {
    initialState.orders.isCustomer = true;
    const action = {
      type: null,
    };
    const newState = orderReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});

describe('Test Suite for order reducer for customer - GET', () => {
  it('should update state with orders if get request is successful', () => {
    initialState.orders.isCustomer = true;
    const action = getOrdersSuccess(getOrdersResponse);
    const state = orderReducer(initialState.orders, action);
    const newState = state.customerOrders;
    expect(newState.orders.length).toBe(4);
    expect(newState.orders[0]).toEqual(getOrdersResponse.orders[0]);
  });

  it('should update state with errors if get request failed', () => {
    initialState.orders.isCustomer = true;
    const action = getOrdersFailed(getOrdersFailedResponse);
    const state = orderReducer(initialState.orders, action);
    const newState = state.customerOrders;
    expect(newState.errors.message).toBe(getOrdersFailedResponse.message);
  });
});

describe('Test Suite for order reducer for customer - DELETE', () => {
  it('should remove order from state if delete is successful', () => {
    initialState.orders.isCustomer = true;
    initialState.orders.customerOrders.orders = [];
    initialState.orders.customerOrders.orders.push(saveOrderResponse.order);
    const action = deleteOrderSuccess(saveOrderResponse.order.id);
    const state = orderReducer(initialState.orders, action);
    const newState = state.customerOrders;
    expect(newState.orders.length).toBe(0);
  });

  it('should not update state if delete failed', () => {
    initialState.orders.isCustomer = true;
    const action = deleteOrderFailed(deleteOrderFailedResponse);
    const state = orderReducer(initialState.orders, action);
    const newState = state.customerOrders;
    expect(newState.orders.length).toBe(1);
  });

  it('should set isCustomer to true if a customer logs in', () => {
    const action = signinSuccess(validCustomer);
    const newState = orderReducer(initialState.orders, action);
    expect(newState.isCaterer).toBe(false);
    expect(newState.isCustomer).toBe(true);
  });

  it('should set isCaterer to true if a caterer logs in', () => {
    const action = signinSuccess(validCaterer);
    const newState = orderReducer(initialState.orders, action);
    expect(newState.isCaterer).toBe(true);
    expect(newState.isCustomer).toBe(false);
  });

  it('should clear out the orders object in state on logout', () => {
    const oldState = initialState.orders;
    const state = orderReducer(initialState.orders, { type: LOGOUT });
    expect(state.isCaterer).toBe(false);
    expect(state.isCustomer).toBe(false);
    expect(state.customerOrders.orders.length).toBe(0);
    expect(state.catererOrders.orders.length).toBe(0);
  });
});
