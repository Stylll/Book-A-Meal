import React from 'react';
import { shallow } from 'enzyme';
import SummaryItem from '../../../src/components/orders/SummaryItem';
import { getOrderSummaryResponse } from '../../helpers/mockOrders';
import { beautifyDate } from '../../../src/utils/utils';

const setup = () => {
  const props = {
    item: getOrderSummaryResponse.orders[0],
  };
  return shallow(<SummaryItem {...props} />);
};

describe('Test suite for Order Item', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('.col').length).toBe(1);
    expect(wrapper.find('h4').length).toBe(4);
    expect(wrapper.find('NavLink').length).toBe(1);
    expect(wrapper.find('p').first().text()).toBe(beautifyDate(getOrderSummaryResponse.orders[0].orderDate));
    expect(wrapper.find('NavLink').length).toBe(1);
  });
});
