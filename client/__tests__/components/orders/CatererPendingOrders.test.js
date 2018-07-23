import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';
import ConnectedCatererPendingOrders, { CatererPendingOrders } from '../../../src/components/orders/CatererPendingOrders';
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
    handleDelete: () => Promise.resolve(),
    actions: {
      saveOrder: () => Promise.resolve(),
      getOrders: () => Promise.resolve(),
    },
    declineItem: () => Promise.resolve(),
  };
  return shallow(<CatererPendingOrders {...props} />);
};

describe('Test Suite for Caterer Pending Orders Component', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('div').length).toBe(1);
    expect(wrapper.find('h1').first().text()).toBe('Pending Orders');
    expect(wrapper.find('OrderList').length).toBe(1);
  });

  it('should render connected component properly', () => {
    const props = {};
    const wrapper = shallow(<ConnectedCatererPendingOrders {...props} store={store} />);
    expect(wrapper.length).toBe(1);
  });

  it('should call saveOrder action when declineItem is called', () => {
    const wrapper = setup();
    const saveOrderSpy = jest.spyOn(wrapper.instance().props.actions, 'saveOrder');
    wrapper.instance().declineItem(getOrdersResponse.orders[0].id);
    expect(saveOrderSpy).toHaveBeenCalled();
  });

  it('should call saveOrder action when approveItem is called', () => {
    const wrapper = setup();
    const saveOrderSpy = jest.spyOn(wrapper.instance().props.actions, 'saveOrder');
    wrapper.instance().approveItem(getOrdersResponse.orders[0].id);
    expect(saveOrderSpy).toHaveBeenCalled();
  });
});
