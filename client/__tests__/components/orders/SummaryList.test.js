import React from 'react';
import { shallow } from 'enzyme';
import SummaryList from '../../../src/components/orders/SummaryList';
import { getOrderSummaryResponse } from '../../helpers/mockOrders';

/* eslint-disable no-undef */
window.scrollTo = jest.fn();

const summary = [
  getOrderSummaryResponse.orders[0], getOrderSummaryResponse.orders[1],
  getOrderSummaryResponse.orders[0], getOrderSummaryResponse.orders[0],
  getOrderSummaryResponse.orders[1], getOrderSummaryResponse.orders[1],
  getOrderSummaryResponse.orders[0], getOrderSummaryResponse.orders[1],
  getOrderSummaryResponse.orders[1], getOrderSummaryResponse.orders[0],
  getOrderSummaryResponse.orders[1], getOrderSummaryResponse.orders[0],
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
    summary,
    pagination,
    fetchData: () => (Promise.resolve()),
  };
  return shallow(<SummaryList {...props} />);
};

describe('Test suite for Summary List', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('.row').length).toBe(3);
    expect(wrapper.find('SummaryItem').length).toBe(12);
    expect(wrapper.find('.container').length).toBe(4);
    expect(wrapper.state().pageCount).toBe(3);
  });

  it('should update pageNo in state when handlePageChange is called', () => {
    const wrapper = setup();
    const newPagination = { ...pagination, pageNo: 2 };
    const props = {
      summary,
      pagination: newPagination,
    };
    wrapper.instance().handlePageChange(props);
    expect(wrapper.state().pageNo).toBe(2);
  });

  it('should display no results found when summary list is empty', () => {
    /* eslint-disable react/jsx-no-bind */
    const newPagination = { ...pagination, noPage: 0 };
    const wrapper =
    shallow(<SummaryList summary={[]}
      pagination={newPagination} />);
    expect(wrapper.find('.row').length).toBe(0);
    expect(wrapper.find('SummaryItem').length).toBe(0);
    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.find('ReactPaginate').length).toBe(0);
    expect(wrapper.find('h3').first().text()).toBe('No Records Found');
    expect(wrapper.state().pageCount).toBe(0);
  });

  it('should call fetchMore function and update state when fetchMore function triggered', () => {
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
