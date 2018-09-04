import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';
import ConnectedEditOrder, { EditOrder } from '../../../src/components/orders/EditOrder';
import { saveMenuResponse } from '../../helpers/mockMenu';
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
  menus: {
    currentMenu: {},
  },
});

const setup = () => {
  const props = {
    actions: {
      saveOrder: () => (Promise.resolve()),
      getMenu: () => (Promise.resolve()),
    },
    menu: saveMenuResponse.menu,
    errors: {},
    match: {
      params: {
        mealId: 1,
      },
    },
  };
  return shallow(<EditOrder {...props} />);
};

const setupB = () => {
  const props = {
    actions: {
      saveOrder: () => (Promise.resolve()),
      getMenu: () => (Promise.resolve()),
    },
    menu: saveMenuResponse.menu,
    orders: getOrdersResponse.orders,
    errors: {},
    match: {
      params: {
        id: 1,
      },
    },
  };
  return shallow(<EditOrder {...props} />);
};

const setupC = () => {
  const props = {
    actions: {
      saveOrder: () => (Promise.resolve()),
      getMenu: () => (Promise.resolve()),
    },
    menu: saveMenuResponse.menu,
    orders: getOrdersResponse.orders,
    errors: {},
    match: {
      params: {
      },
    },
    history: [],
  };
  return shallow(<EditOrder {...props} />);
};

describe('Test suite for EditOrder component', () => {
  it('should render unconnected component properly', () => {
    const wrapper = setup();
    expect(wrapper.find('TextInput').length).toBe(1);
    expect(wrapper.find('NavLink').length).toBe(1);
    expect(wrapper.find('h1').first().text()).toBe('Confirm your order');
    expect(wrapper.find('h2').first().text()).toBe(saveMenuResponse.menu.meals[0].name);
    expect(wrapper.find('h4').first().text()).toContain(saveMenuResponse.menu.meals[0].price);
    expect(wrapper.find('input').last().prop('type')).toBe('button');
  });

  it('should return error when invalid input is submitted', () => {
    const wrapper = setup();
    wrapper.setState({
      quantity: 0,
    });
    const handleSubmitSpy = jest.spyOn(wrapper.instance(), 'handleSubmit');
    const event = {
      preventDefault: jest.fn(),
    };
    wrapper.instance().handleSubmit(event);
    const state = wrapper.state();
    expect(handleSubmitSpy).toHaveBeenCalled();
    expect(state.errors.quantity).toBe('Quantity must be greater than zero');
  });

  it('should call saveOrder action when handleSubmit function is called when saving an order', () => {
    const wrapper = setup();
    wrapper.setState({
      quantity: 1,
    });
    const handleSubmitSpy = jest.spyOn(wrapper.instance(), 'handleSubmit');
    const saveOrderSpy = jest.spyOn(wrapper.instance().props.actions, 'saveOrder');
    const sendOrderSpy = jest.spyOn(wrapper.instance(), 'sendOrder');
    const event = {
      preventDefault: jest.fn(),
    };
    wrapper.instance().handleSubmit(event);
    expect(handleSubmitSpy).toHaveBeenCalled();
    expect(saveOrderSpy).toHaveBeenCalled();
    expect(sendOrderSpy).toHaveBeenCalled();
  });

  it('should call saveOrder action when handleSubmit function is called when updating an order', () => {
    const wrapper = setupB();
    wrapper.setState({
      quantity: 3,
    });
    const handleSubmitSpy = jest.spyOn(wrapper.instance(), 'handleSubmit');
    const saveOrderSpy = jest.spyOn(wrapper.instance().props.actions, 'saveOrder');
    const sendOrderSpy = jest.spyOn(wrapper.instance(), 'sendOrder');
    const event = {
      preventDefault: jest.fn(),
    };
    wrapper.instance().handleSubmit(event);
    const state = wrapper.state();
    expect(handleSubmitSpy).toHaveBeenCalled();
    expect(saveOrderSpy).toHaveBeenCalled();
    expect(sendOrderSpy).toHaveBeenCalled();
  });

  it('should update state when handleChange function is called', () => {
    const wrapper = setup();
    const handleChangeSpy = jest.spyOn(wrapper.instance(), 'handleChange');
    const event = {
      preventDefault: jest.fn(),
      target: {
        name: 'quantity',
        value: '2',
      },
    };
    wrapper.instance().handleChange(event);
    const state = wrapper.state();
    expect(handleChangeSpy).toHaveBeenCalled();
    expect(state.quantity).toBe('2');
  });

  it('should render connected component properly', () => {
    const props = {};
    const wrapper = shallow(<ConnectedEditOrder {...props} store={store} />);
    expect(wrapper.length).toBe(1);
  });

  it('redirects to menu page if id or meal id is not provided', () => {
    const wrapper = setupC();
    const result = wrapper.instance().props.history;
    expect(result[0]).toBe('/customer/menu');
  });
});
