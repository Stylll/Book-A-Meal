import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ConnectedManageMenu, { ManageMenus } from '../../../src/components/menu/ManageMenus';
import { validMenu, emptyMenu, invalidMenu, getMenuResponse } from '../../helpers/mockMenu';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({
  menus: {
    menus: [],
    errors: {},
  },
});

const menuArr = [
  getMenuResponse.menus[0], getMenuResponse.menus[1],
  getMenuResponse.menus[0], getMenuResponse.menus[1],
  getMenuResponse.menus[0], getMenuResponse.menus[1],
  getMenuResponse.menus[0], getMenuResponse.menus[1],
];

const setup = () => {
  const props = {
    menus: menuArr,
    handleDelete: () => Promise.resolve(),
    actions: {
      deleteMenu: () => Promise.resolve(),
    },
    deleteItem: () => Promise.resolve(),
    pageSize: 8,
  };
  return shallow(<ManageMenus {...props} />);
};

describe('Test suite for ManageMenus Component', () => {
  it('should render unconnected component properly', () => {
    const wrapper = setup();
    expect(wrapper.find('div').length).toBe(4);
    expect(wrapper.find('MenuList').length).toBe(1);
  });

  it('should render connected component properly', () => {
    const props = {};
    const wrapper = shallow(<ConnectedManageMenu {...props} store={store} />);
    expect(wrapper.length).toBe(1);
  });
});
