import orderReducer from '../../src/reducers/orderReducer';
import initialState from '../../src/reducers/initialState';
import {
  saveOrder,
  saveOrderSuccess, saveOrderFailed,
} from '../../src/actions/orderActions';
import { SAVE_ORDER_SUCCESS, SAVE_ORDER_FAILED } from '../../src/actions/actionTypes';
import {
  saveOrderResponse,
  saveOrderFailedResponse, saveOrderFailedResponseB,
} from '../helpers/mockOrders';

describe('Test Suite for Order Reducer - SAVE', () => {
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
