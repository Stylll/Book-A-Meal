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
                    .orders.filter(order => order.id !== action.order.id), action.order,
                ],
            errors: state.customerOrders.errors,
            pagination: state.customerOrders.pagination,
          },
        };

      case types.SAVE_ORDER_FAILED:
        return {
          ...state,
          customerOrders: {
            orders: state.customerOrders.orders,
            errors: action.errors,
            pagination: state.customerOrders.pagination,
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
            pagination: state.customerOrders.pagination,
          },
        };

      case types.DELETE_ORDER_SUCCESS:
        return {
          ...state,
          customerOrders: {
            orders: state.customerOrders.orders.filter(order => order.id !== action.orderId),
            errors: {},
            pagination: state.customerOrders.pagination,
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
            pagination: {},
          },
          catererOrders: {
            orders: [],
            errors: {},
            pagination: {},
          },
        };

      default:
        return state;
    }
  }

  return catererOrderReducer(state, action);
};

export default orderReducer;
