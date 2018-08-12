import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';
import ConnectedViewOrders, { ViewOrders } from '../../../src/components/orders/ViewOrders';
import { getOrdersResponse } from '../../helpers/mockOrders';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({
  orders: {
    customerOrders: {
      orders: [],
      errors: {},
    },
  },
});

const setup = () => {
  const props = {
    orders: getOrdersResponse.orders,
    errors: {},
    actions: {
      getOrders: () => Promise.resolve(),
    },
  };
  return shallow(<ViewOrders {...props} />);
};

describe('Test Suite for Manage Order Component', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('div').length).toBe(1);
    expect(wrapper.find('h1').first().text()).toBe('My Order History');
    expect(wrapper.find('OrderTable').length).toBe(1);
  });

  it('should render connected component properly', () => {
    const props = {};
    const wrapper = shallow(<ConnectedViewOrders {...props} store={store} />);
    expect(wrapper.length).toBe(1);
  });
});
