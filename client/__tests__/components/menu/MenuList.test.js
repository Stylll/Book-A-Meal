import React from 'react';
import { shallow } from 'enzyme';
import MenuList from '../../../src/components/menu/MenuList';
import { getMenuResponse } from '../../helpers/mockMenu';

/* eslint-disable no-undef */
window.scrollTo = jest.fn();

const menuArr = [
  getMenuResponse.menus[0], getMenuResponse.menus[1],
  getMenuResponse.menus[0], getMenuResponse.menus[1],
  getMenuResponse.menus[0], getMenuResponse.menus[1],
  getMenuResponse.menus[0], getMenuResponse.menus[1],
];

const setup = () => {
  const props = {
    menus: menuArr,
    perPage: 4,
  };
  return shallow(<MenuList {...props} />);
};

describe('Test Suite for MenuList component', () => {
  it('should render component properly', () => {
    const wrapper = setup();
    expect(wrapper.find('.card-container').length).toBe(1);
    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.find('.card-container').length).toBe(1);
    expect(wrapper.find('MenuItem').length).toBe(4);
    expect(wrapper.state().pageCount).toBe(2);
  });

  it('should update state with current page no when handlePageChange is called', () => {
    const wrapper = setup();
    wrapper.instance().handlePageChange({ selected: 1 });
    expect(wrapper.state().pageNo).toBe(2);
  });

  it('should display no records found if empty menu list is passed', () => {
    /* eslint-disable react/jsx-no-bind */
    const wrapper =
    shallow(<MenuList menus={[]} perPage={4} handleDelete={() => Promise.resolve()} />);
    expect(wrapper.find('.card-container').length).toBe(0);
    expect(wrapper.find('MenuItem').length).toBe(0);
    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.find('ReactPaginate').length).toBe(0);
    expect(wrapper.find('h3').first().text()).toBe('No Records Found');
    expect(wrapper.state().pageCount).toBe(0);
  });
});