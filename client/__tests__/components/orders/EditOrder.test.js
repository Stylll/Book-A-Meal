import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';
import ConnectedConfirmOrder, { EditOrder } from '../../../src/components/orders/EditOrder';
import { saveMenuResponse } from '../../helpers/mockMenu';

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

describe('Test suite for EditOrder component', () => {
  it('should render unconnected component properly', () => {
    const wrapper = setup();
    expect(wrapper.find('select').length).toBe(1);
    expect(wrapper.find('NavLink').length).toBe(1);
    expect(wrapper.find('h1').first().text()).toBe('Confirm your order');
    expect(wrapper.find('h1').last().text()).toBe(saveMenuResponse.menu.meals[0].name);
    expect(wrapper.find('h3').first().text()).toContain(saveMenuResponse.menu.meals[0].price);
    expect(wrapper.find('input').last().prop('type')).toBe('button');
  });

  it('should return error for invalid input', () => {
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

  it('should call handleSubmit function and saveOrder action', () => {
    const wrapper = setup();
    wrapper.setState({
      quantity: 1,
    });
    const handleSubmitSpy = jest.spyOn(wrapper.instance(), 'handleSubmit');
    const saveOrderSpy = jest.spyOn(wrapper.instance().props.actions, 'saveOrder');
    const event = {
      preventDefault: jest.fn(),
    };
    wrapper.instance().handleSubmit(event);
    const state = wrapper.state();
    expect(handleSubmitSpy).toHaveBeenCalled();
    expect(saveOrderSpy).toHaveBeenCalled();
  });

  it('should render connected component properly', () => {
    const props = {};
    const wrapper = shallow(<ConnectedConfirmOrder {...props} store={store} />);
    expect(wrapper.length).toBe(1);
  });
});
