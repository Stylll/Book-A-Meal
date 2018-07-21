import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';
import ConnectedCatererViewOrders, { CatererViewOrders } from '../../../src/components/orders/CatererViewOrders';
import { getOrdersResponse } from '../../helpers/mockOrders';

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
    orders: getOrdersResponse.orders,
    errors: {},
    actions: {
      getOrders: () => Promise.resolve(),
    },
  };
  return shallow(<CatererViewOrders {...props} />);
};

describe('Test Suite for Manage Order Component', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('div').length).toBe(1);
    expect(wrapper.find('h1').first().text()).toBe('Customer Order History');
    expect(wrapper.find('OrderList').length).toBe(1);
  });

  it('should render connected component properly', () => {
    const props = {};
    const wrapper = shallow(<ConnectedCatererViewOrders {...props} store={store} />);
    expect(wrapper.length).toBe(1);
  });
});
