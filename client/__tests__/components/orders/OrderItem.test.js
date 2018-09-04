import React from 'react';
import { shallow } from 'enzyme';
import OrderItem from '../../../src/components/orders/OrderItem';
import { getOrdersResponse } from '../../helpers/mockOrders';

const setup = () => {
  const props = {
    order: getOrdersResponse.orders[0],
    handleDelete: () => Promise.resolve(),
    handleApprove: () => Promise.resolve(),
    handleDecline: () => Promise.resolve(),
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

  it('should display only edit and delete link when showEdit and showDelete props are true', () => {
    const props = {
      showEdit: true,
      showDelete: true,
      order: getOrdersResponse.orders[0],
      handleDelete: () => Promise.resolve(),
      handleApprove: () => Promise.resolve(),
      handleDecline: () => Promise.resolve(),
    };
    const wrapper = shallow(<OrderItem {...props} />);
    expect(wrapper.find('a').length).toBe(1);
    expect(wrapper.find('NavLink').length).toBe(1);
  });

  it('should not display edit and delete links when showEdit and showDelete props are false', () => {
    const props = {
      showEdit: false,
      showDelete: false,
      order: getOrdersResponse.orders[0],
      handleDelete: () => Promise.resolve(),
      handleApprove: () => Promise.resolve(),
      handleDecline: () => Promise.resolve(),
    };
    const wrapper = shallow(<OrderItem {...props} />);
    expect(wrapper.find('a').length).toBe(0);
    expect(wrapper.find('NavLink').length).toBe(0);
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
    const wrapper = shallow(<OrderItem {...props} />);
    expect(wrapper.find('a').length).toBe(2);
  });

  it('should not display approve and decline links when showApprove and showDecline props are false', () => {
    const props = {
      showApprove: false,
      showDecline: false,
      order: getOrdersResponse.orders[0],
      handleDelete: () => Promise.resolve(),
      handleApprove: () => Promise.resolve(),
      handleDecline: () => Promise.resolve(),
    };
    const wrapper = shallow(<OrderItem {...props} />);
    expect(wrapper.find('a').length).toBe(0);
  });

  it('should display customer name when showCustomer props is true', () => {
    const props = {
      showCustomer: true,
      order: getOrdersResponse.orders[0],
      handleDelete: () => Promise.resolve(),
    };
    const wrapper = shallow(<OrderItem {...props} />);
    expect(wrapper.find('h4').last().text()).toContain(getOrdersResponse.orders[0].user.username);
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
    const wrapper = shallow(<OrderItem {...props} />);
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
    const wrapper = shallow(<OrderItem {...props} />);
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
    const wrapper = shallow(<OrderItem {...props} />);
    wrapper.find('a').first().simulate('click');
    expect(props.handleDelete).toHaveBeenCalled();
  });
});
