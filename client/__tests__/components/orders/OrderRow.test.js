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

  it('should display only edit and delete link when showEdit and showDelete props are true', () => {
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

  it('should not display any links when showEdit and showDelete props are false', () => {
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

  it('should display only approve and decline link when showApprove and showDecline props are true', () => {
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

  it('should display customer name when showCustomer props is true', () => {
    const props = {
      showCustomer: true,
      order: getOrdersResponse.orders[0],
      handleDelete: () => Promise.resolve(),
    };
    const wrapper = shallow(<OrderRow {...props} />);
    expect(wrapper.find('.customer').last().text())
      .toContain(getOrdersResponse.orders[0].user.username);
  });

  it('should display status when showStatus props is true', () => {
    const props = {
      showStatus: true,
      order: getOrdersResponse.orders[0],
      handleDelete: () => Promise.resolve(),
    };
    const wrapper = shallow(<OrderRow {...props} />);
    expect(wrapper.find('.status').length).toBe(1);
  });

  it('should call handleApprove method when approve button is clicked', () => {
    const props = {
      showApprove: true,
      showDecline: true,
      order: getOrdersResponse.orders[0],
      handleDelete: () => Promise.resolve(),
      handleApprove: jest.fn(),
      handleDecline: () => Promise.resolve(),
    };
    const wrapper = shallow(<OrderRow {...props} />);
    wrapper.find('a').first().simulate('click');
    expect(props.handleApprove).toHaveBeenCalled();
  });

  it('should call handleDelete method when delete button is clicked', () => {
    const props = {
      showApprove: true,
      showDecline: true,
      order: getOrdersResponse.orders[0],
      handleDelete: () => Promise.resolve(),
      handleApprove: () => Promise.resolve(),
      handleDecline: jest.fn(),
    };
    const wrapper = shallow(<OrderRow {...props} />);
    wrapper.find('a').last().simulate('click');
    expect(props.handleDecline).toHaveBeenCalled();
  });

  it('should call handleDecline method when decline button is clicked', () => {
    const props = {
      showDelete: true,
      order: getOrdersResponse.orders[0],
      handleDelete: jest.fn(),
      handleApprove: () => Promise.resolve(),
      handleDecline: () => Promise.resolve(),
    };
    const wrapper = shallow(<OrderRow {...props} />);
    wrapper.find('a').first().simulate('click');
    expect(props.handleDelete).toHaveBeenCalled();
  });
});
