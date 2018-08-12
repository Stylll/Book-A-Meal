import React from 'react';
import { shallow } from 'enzyme';
import OrderRow from '../../../src/components/orders/OrderRow';
import { getOrdersResponse } from '../../helpers/mockOrders';

const setup = () => {
  const props = {
    order: getOrdersResponse.orders[0],
    handleDelete: () => Promise.resolve(),
    handleApprove: () => Promise.resolve(),
    handleDecline: () => Promise.resolve(),
  };
  return shallow(<OrderRow {...props} />);
};

describe('Test suite for Order Row', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('tr').length).toBe(1);
    expect(wrapper.find('td').length).toBe(7);
    expect(wrapper.find('.orderId').length).toBe(1);
    expect(wrapper.find('.meal-title').length).toBe(1);
    expect(wrapper.find('.quantity').length).toBe(1);
    expect(wrapper.find('.price').length).toBe(1);
    expect(wrapper.find('.cost').length).toBe(1);
    expect(wrapper.find('.orderdate').length).toBe(1);
  });

  it('should display only edit and delete link', () => {
    const props = {
      showEdit: true,
      showDelete: true,
      order: getOrdersResponse.orders[0],
      handleDelete: () => Promise.resolve(),
      handleApprove: () => Promise.resolve(),
      handleDecline: () => Promise.resolve(),
    };
    const wrapper = shallow(<OrderRow {...props} />);
    expect(wrapper.find('a').length).toBe(1);
    expect(wrapper.find('NavLink').length).toBe(1);
    expect(wrapper.find('.edit').length).toBe(1);
    expect(wrapper.find('.delete a').length).toBe(1);
    expect(wrapper.find('.approve a').length).toBe(0);
    expect(wrapper.find('.decline a').length).toBe(0);
  });

  it('should not display any links', () => {
    const props = {
      showEdit: false,
      showDelete: false,
      order: getOrdersResponse.orders[0],
      handleDelete: () => Promise.resolve(),
      handleApprove: () => Promise.resolve(),
      handleDecline: () => Promise.resolve(),
    };
    const wrapper = shallow(<OrderRow {...props} />);
    expect(wrapper.find('a').length).toBe(0);
    expect(wrapper.find('NavLink').length).toBe(0);
    expect(wrapper.find('.edit').length).toBe(0);
    expect(wrapper.find('.delete a').length).toBe(0);
    expect(wrapper.find('.approve a').length).toBe(0);
    expect(wrapper.find('.decline a').length).toBe(0);
  });

  it('should display only approve and decline link', () => {
    const props = {
      showApprove: true,
      showDecline: true,
      order: getOrdersResponse.orders[0],
      handleDelete: () => Promise.resolve(),
      handleApprove: () => Promise.resolve(),
      handleDecline: () => Promise.resolve(),
    };
    const wrapper = shallow(<OrderRow {...props} />);
    expect(wrapper.find('a').length).toBe(2);
    expect(wrapper.find('.approve a').length).toBe(1);
    expect(wrapper.find('.decline a').length).toBe(1);
  });

  it('should display customer name', () => {
    const props = {
      showCustomer: true,
      order: getOrdersResponse.orders[0],
      handleDelete: () => Promise.resolve(),
    };
    const wrapper = shallow(<OrderRow {...props} />);
    expect(wrapper.find('.customer').last().text())
      .toContain(getOrdersResponse.orders[0].user.username);
  });

  it('should display status', () => {
    const props = {
      showStatus: true,
      order: getOrdersResponse.orders[0],
      handleDelete: () => Promise.resolve(),
    };
    const wrapper = shallow(<OrderRow {...props} />);
    expect(wrapper.find('.status').length).toBe(1);
  });
});
