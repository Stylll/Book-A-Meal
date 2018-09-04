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
                    .orders.filter(order => order.id !== action.order.id), action.order,
                ],
            summary: state.catererOrders.summary,
            errors: state.catererOrders.errors,
            pagination: state.catererOrders.pagination,
          },
        };

      case types.SAVE_ORDER_FAILED:
        return {
          ...state,
          catererOrders: {
            orders: state.catererOrders.orders,
            errors: action.errors,
            summary: state.catererOrders.summary,
            pagination: state.catererOrders.pagination,
          },
        };

      case types.GET_ORDERS_SUCCESS:
        return {
          ...state,
          catererOrders: {
            orders: action.orders,
            errors: {},
            summary: state.catererOrders.summary,
            pagination: action.pagination,
          },
        };

      case types.GET_ORDERS_FAILED:
        return {
          ...state,
          catererOrders: {
            orders: state.catererOrders.orders,
            errors: action.errors,
            summary: state.catererOrders.summary,
            pagination: state.catererOrders.pagination,
          },
        };

      case types.DELETE_ORDER_SUCCESS:
        return {
          ...state,
          catererOrders: {
            orders: state.catererOrders.orders.filter(order => order.id !== action.orderId),
            errors: {},
            summary: state.catererOrders.summary,
            pagination: state.catererOrders.pagination,
          },
        };

      case types.DELETE_ORDER_FAILED:
        return {
          ...state,
        };

      case types.GET_ORDER_SUMMARY_SUCCESS:
        return {
          ...state,
          catererOrders: {
            orders: state.catererOrders.orders,
            errors: {},
            summary: action.summary,
            pagination: action.pagination,
          },
        };

      case types.GET_ORDER_SUMMARY_FAILED:
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
