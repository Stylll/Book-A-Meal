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
const pagination = {
  totalCount: 10,
  limit: 4,
  offset: 0,
  noPage: 3,
  pageNo: 1,
};

const setup = () => {
  const props = {
    orders,
    handleDelete: () => Promise.resolve(),
    pagination,
    fetchData: () => (Promise.resolve()),
  };
  return shallow(<OrderList {...props} />);
};

describe('Test suite for Order List', () => {
  it('should render properly', () => {
    const wrapper = setup();
    wrapper.setState({ loading: false });
    expect(wrapper.find('.card-container').length).toBe(3);
    expect(wrapper.find('OrderItem').length).toBe(12);
    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.state().pageCount).toBe(3);
    expect(wrapper.state().perPage).toBe(4);
  });

  it('should update pageNo in state when handlePageChange is called', () => {
    const wrapper = setup();
    const newPagination = { ...pagination, pageNo: 2 };
    const props = {
      orders,
      pagination: newPagination,
    };
    wrapper.instance().handlePageChange(props);
    expect(wrapper.state().pageNo).toBe(2);
  });

  it('should display no results found when pagination pageCount is zero', () => {
    /* eslint-disable react/jsx-no-bind */
    const newPagination = { ...pagination, noPage: 0 };
    const wrapper =
    shallow(<OrderList
        orders={[]}
        pagination={newPagination}
        handleDelete={() => Promise.resolve()} />);
    expect(wrapper.find('.card-container').length).toBe(0);
    expect(wrapper.find('OrderItem').length).toBe(0);
    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.find('ReactPaginate').length).toBe(0);
    expect(wrapper.find('h3').first().text()).toBe('No Records Found');
    expect(wrapper.state().pageCount).toBe(0);
  });

  it('should call fetchMore function and update state when triggered', () => {
    const wrapper = setup();
    const fetchMoreSpy = jest.spyOn(wrapper.instance(), 'fetchMore');
    const event = {
      preventDefault: jest.fn(),
    };
    wrapper.instance().fetchMore();
    expect(wrapper.state().loading).toBe(true);
    expect(fetchMoreSpy).toHaveBeenCalled();
  });
});
