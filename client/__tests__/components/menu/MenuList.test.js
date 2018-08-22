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

const pagination = {
  totalCount: 8,
  limit: 4,
  offset: 0,
  noPage: 2,
  pageNo: 1,
};

const setup = () => {
  const props = {
    menus: menuArr,
    pagination,
    fetchData: () => (Promise.resolve()),
  };
  return shallow(<MenuList {...props} />);
};

describe('Test Suite for MenuList component', () => {
  it('should render component properly', () => {
    const wrapper = setup();
    wrapper.setState({ loading: false });
    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.find('.card-container').length).toBe(2);
    expect(wrapper.find('MenuItem').length).toBe(8);
    expect(wrapper.state().pageCount).toBe(2);
  });

  it('should update state with current page no when handlePageChange is called', () => {
    const wrapper = setup();
    const newPagination = { ...pagination, pageNo: 2 };
    const props = {
      menus: menuArr,
      pagination: newPagination,
    };
    wrapper.instance().handlePageChange(props);
    expect(wrapper.state().pageNo).toBe(2);
  });

  it('should display no records found if empty menu list is passed', () => {
    /* eslint-disable react/jsx-no-bind */
    const newPagination = { ...pagination, noPage: 0 };
    const wrapper =
    shallow(<MenuList menus={[]}
      pagination={newPagination}
      handleDelete={() => Promise.resolve()} />);
    expect(wrapper.find('.card-container').length).toBe(0);
    expect(wrapper.find('MenuItem').length).toBe(0);
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
