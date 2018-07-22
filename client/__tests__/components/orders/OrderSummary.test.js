import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';
import ConnectedOrderSummary, { OrderSummary } from '../../../src/components/orders/OrderSummary';
import { getOrderSummaryResponse } from '../../helpers/mockOrders';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({
  orders: {
    catererOrders: {
      orders: [],
      errors: {},
    },
  },
});

const setup = () => {
  const props = {
    orders: getOrderSummaryResponse.orders,
    errors: {},
    actions: {
      getOrderSummary: () => Promise.resolve(),
    },
  };
  return shallow(<OrderSummary {...props} />);
};

describe('Test Suite for Manage Order Component', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('div').length).toBe(1);
    expect(wrapper.find('h1').first().text()).toBe('Customer Order Summary');
    expect(wrapper.find('SummaryList').length).toBe(1);
  });

  it('should render connected component properly', () => {
    const props = {};
    const wrapper = shallow(<ConnectedOrderSummary {...props} store={store} />);
    expect(wrapper.length).toBe(1);
  });
});
