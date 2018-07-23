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
const setup = () => {
  const props = {
    summary,
    perPage: 4,
  };
  return shallow(<SummaryList {...props} />);
};

describe('Test suite for Summary List', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('.row').length).toBe(1);
    expect(wrapper.find('SummaryItem').length).toBe(4);
    expect(wrapper.find('.container').length).toBe(2);
    expect(wrapper.state().pageCount).toBe(3);
  });

  it('should update pageNo in state when handlePageChange is called', () => {
    const wrapper = setup();
    wrapper.instance().handlePageChange({ selected: 1 });
    expect(wrapper.state().pageNo).toBe(2);
  });

  it('should display no results found when summary list is empty', () => {
    /* eslint-disable react/jsx-no-bind */
    const wrapper =
    shallow(<SummaryList summary={[]} perPage={4} />);
    expect(wrapper.find('.row').length).toBe(0);
    expect(wrapper.find('SummaryItem').length).toBe(0);
    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.find('ReactPaginate').length).toBe(0);
    expect(wrapper.find('h3').first().text()).toBe('No Records Found');
    expect(wrapper.state().pageCount).toBe(0);
  });
});
