import React from 'react';
import { shallow } from 'enzyme';
import OrderList from '../../../src/components/orders/OrderList';
import { getOrdersResponse } from '../../helpers/mockOrders';

/* eslint-disable no-undef */
window.scrollTo = jest.fn();

const orders = [
  getOrdersResponse.orders[0], getOrdersResponse.orders[1], getOrdersResponse.orders[2],
  getOrdersResponse.orders[0], getOrdersResponse.orders[1], getOrdersResponse.orders[2],
  getOrdersResponse.orders[0], getOrdersResponse.orders[1], getOrdersResponse.orders[2],
  getOrdersResponse.orders[0], getOrdersResponse.orders[1], getOrdersResponse.orders[2],
];
const setup = () => {
  const props = {
    orders,
    handleDelete: () => Promise.resolve(),
    perPage: 4,
  };
  return shallow(<OrderList {...props} />);
};

describe('Test suite for Order List', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('.card-container').length).toBe(1);
    expect(wrapper.find('OrderItem').length).toBe(4);
    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.state().pageCount).toBe(3);
  });

  it('should update pageNo in state when handlePageChange is called', () => {
    const wrapper = setup();
    wrapper.instance().handlePageChange({ selected: 1 });
    expect(wrapper.state().pageNo).toBe(2);
  });

  it('should display no results found when order list is empty', () => {
    /* eslint-disable react/jsx-no-bind */
    const wrapper =
    shallow(<OrderList orders={[]} perPage={4} handleDelete={() => Promise.resolve()} />);
    expect(wrapper.find('.card-container').length).toBe(0);
    expect(wrapper.find('OrderItem').length).toBe(0);
    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.find('ReactPaginate').length).toBe(0);
    expect(wrapper.find('h3').first().text()).toBe('No Records Found');
    expect(wrapper.state().pageCount).toBe(0);
  });
});
