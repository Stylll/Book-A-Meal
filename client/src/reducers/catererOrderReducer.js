import initialState from './initialState';
import * as types from '../actions/actionTypes';

const orderReducer = (state = initialState.orders, action) => {
  if (action.type === types.SIGNIN_SUCCESS || action.type === types.SIGNUP_SUCCESS) {
    if (action.user.accountType === 'caterer') {
      return {
        ...state,
        isCustomer: false,
        isCaterer: true,
      };
    }
  }

  if (state.isCaterer) {
    switch (action.type) {
      case types.SAVE_ORDER_SUCCESS:
        return {
          ...state,
          catererOrders: {
            orders:
                [
                  ...state.catererOrders
                    .orders.filter(m => m.id !== action.order.id), action.order,
                ],
            errors: state.catererOrders.errors,
          },
        };

      case types.SAVE_ORDER_FAILED:
        return {
          ...state,
          catererOrders: {
            orders: state.catererOrders.orders,
            errors: action.errors,
          },
        };

      case types.GET_ORDERS_SUCCESS:
        return {
          ...state,
          catererOrders: {
            orders: action.orders,
            errors: {},
          },
        };

      case types.GET_ORDERS_FAILED:
        return {
          ...state,
          catererOrders: {
            orders: state.catererOrders.orders,
            errors: action.errors,
          },
        };

      case types.DELETE_ORDER_SUCCESS:
        return {
          ...state,
          catererOrders: {
            orders: state.catererOrders.orders.filter(m => m.id !== action.orderId),
            errors: {},
          },
        };

      case types.DELETE_ORDER_FAILED:
        return {
          ...state,
        };
      default:
        return state;
    }
  }
  return state;
};

export default orderReducer;
