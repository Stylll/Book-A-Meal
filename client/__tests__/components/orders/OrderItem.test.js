import React from 'react';
import { shallow } from 'enzyme';
import OrderItem from '../../../src/components/orders/OrderItem';
import { getOrdersResponse } from '../../helpers/mockOrders';

const setup = () => {
  const props = {
    order: getOrdersResponse.orders[0],
    handleDelete: () => Promise.resolve(),
  };
  return shallow(<OrderItem {...props} />);
};

describe('Test suite for Order Item', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('.card').length).toBe(1);
    expect(wrapper.find('.flex-display').length).toBe(1);
    expect(wrapper.find('.card-img-container').length).toBe(1);
    expect(wrapper.find('.card-content').length).toBe(1);
    expect(wrapper.find('h3').length).toBe(1);
    expect(wrapper.find('h3').first().text()).toBe(getOrdersResponse.orders[0].meal.name);
    expect(wrapper.find('h4').first().text()).toContain(getOrdersResponse.orders[0].id);
    expect(wrapper.find('div').length).toBe(4);
    expect(wrapper.find('img').length).toBe(1);
  });

  it('should display only edit and delete link', () => {
    const props = {
      showEdit: true,
      showDelete: true,
      order: getOrdersResponse.orders[0],
      handleDelete: () => Promise.resolve(),
    };
    const wrapper = shallow(<OrderItem {...props} />);
    expect(wrapper.find('a').length).toBe(1);
    expect(wrapper.find('NavLink').length).toBe(1);
  });

  it('should not display edit and delete links', () => {
    const props = {
      showEdit: false,
      showDelete: false,
      order: getOrdersResponse.orders[0],
      handleDelete: () => Promise.resolve(),
    };
    const wrapper = shallow(<OrderItem {...props} />);
    expect(wrapper.find('a').length).toBe(0);
    expect(wrapper.find('NavLink').length).toBe(0);
  });

  it('should display customer name', () => {
    const props = {
      showCustomer: true,
      order: getOrdersResponse.orders[0],
      handleDelete: () => Promise.resolve(),
    };
    const wrapper = shallow(<OrderItem {...props} />);
    expect(wrapper.find('h4').last().text()).toContain(getOrdersResponse.orders[0].user.username);
  });
});
