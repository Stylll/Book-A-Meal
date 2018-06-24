import React from 'react';
import { shallow } from 'enzyme';
import MenuItem from '../../../src/components/menu/MenuItem';
import { getMenuResponse } from '../../helpers/mockMenu';

const setup = () => {
  const props = {
    menu: getMenuResponse.menus[0],
  };
  return shallow(<MenuItem {...props} />);
};

describe('Test suite for MenuItem component', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('.hor-card').length).toBe(1);
    expect(wrapper.find('.flex-display').length).toBe(1);
    expect(wrapper.find('.menu').length).toBe(1);
    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.find('.menu-item').length).toBe(2);
    expect(wrapper.find('h3').first().text()).toBe('Menu For Friday, 15 June 2018');
    expect(wrapper.find('NavLink').length).toBe(2);
  });
});