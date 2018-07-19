import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';
import ConnectedMyPendingOrders, { MyPendingOrders } from '../../../src/components/orders/MyPendingOrders';
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
    handleDelete: () => Promise.resolve(),
    actions: {
      saveOrder: () => Promise.resolve(),
      getOrders: () => Promise.resolve(),
    },
    deleteItem: () => Promise.resolve(),
  };
  return shallow(<MyPendingOrders {...props} />);
};

describe('Test Suite for My Pending Orders Component', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('div').length).toBe(1);
    expect(wrapper.find('h1').first().text()).toBe('Pending Orders');
    expect(wrapper.find('OrderList').length).toBe(1);
  });

  it('should render connected component properly', () => {
    const props = {};
    const wrapper = shallow(<ConnectedMyPendingOrders {...props} store={store} />);
    expect(wrapper.length).toBe(1);
  });

  it('should call saveOrder action when deleteItem is called', () => {
    const wrapper = setup();
    const saveOrderSpy = jest.spyOn(wrapper.instance().props.actions, 'saveOrder');
    wrapper.instance().deleteItem(getOrdersResponse.orders[0].id);
    expect(saveOrderSpy).toHaveBeenCalled();
  });
});
