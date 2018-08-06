import initialState from './initialState';
import * as types from '../actions/actionTypes';
import catererOrderReducer from './catererOrderReducer';

const orderReducer = (state = initialState.orders, action) => {
  if (action.type === types.SIGNIN_SUCCESS || action.type === types.SIGNUP_SUCCESS) {
    if (action.user.accountType === 'customer') {
      return {
        ...state,
        isCustomer: true,
        isCaterer: false,
      };
    }
    return {
      ...state,
      isCustomer: false,
      isCaterer: true,
    };
  }

  if (state.isCustomer) {
    switch (action.type) {
      case types.SAVE_ORDER_SUCCESS:
        return {
          ...state,
          customerOrders: {
            orders:
                [
                  ...state.customerOrders
                    .orders.filter(m => m.id !== action.order.id), action.order,
                ],
            errors: state.customerOrders.errors,
          },
        };

      case types.SAVE_ORDER_FAILED:
        return {
          ...state,
          customerOrders: {
            orders: state.customerOrders.orders,
            errors: action.errors,
          },
        };

      case types.GET_ORDERS_SUCCESS:
        return {
          ...state,
          customerOrders: {
            orders: action.orders,
            errors: {},
            pagination: action.pagination,
          },
        };

      case types.GET_ORDERS_FAILED:
        return {
          ...state,
          customerOrders: {
            orders: state.customerOrders.orders,
            errors: action.errors,
          },
        };

      case types.DELETE_ORDER_SUCCESS:
        return {
          ...state,
          customerOrders: {
            orders: state.customerOrders.orders.filter(m => m.id !== action.orderId),
            errors: {},
          },
        };

      case types.DELETE_ORDER_FAILED:
        return {
          ...state,
        };

      case types.LOGOUT:
        return {
          ...state,
          isCustomer: false,
          isCaterer: false,
          customerOrders: {
            orders: [],
            errors: {},
          },
          catererOrders: {
            orders: [],
            errors: {},
          },
        };

      default:
        return state;
    }
  }

  return catererOrderReducer(state, action);
};

export default orderReducer;
