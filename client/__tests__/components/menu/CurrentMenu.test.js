import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ConnectedCurrentMenu, { CurrentMenu } from '../../../src/components/menu/CurrentMenu';
import { getMenuResponse } from '../../helpers/mockMenu';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({
  menus: {
    menus: [],
    errors: {},
    currentMenu: {},
  },
});

const setup = () => {
  const props = {
    currentMenu: getMenuResponse.menus[0],
    actions: {
      getMenu: () => Promise.resolve(),
    },
  };
  return shallow(<CurrentMenu {...props} />);
};

describe('Test suite for CurrentMenu component', () => {
  it('should render unconnected component properly', () => {
    const wrapper = setup();
    expect(wrapper.find('div').length).toBe(3);
    expect(wrapper.find('h1').first().text()).toBe('Welcome to Book-A-Meal');
    expect(wrapper.find('h4').first().text()).toBe('Your online restaurant to find the finest cuisines.');
    expect(wrapper.find('p').first().text()).toBe('Below is a list of our meal options for the day');
  });

  it('should render connected component properly', () => {
    const props = {};
    const wrapper = shallow(<ConnectedCurrentMenu {...props} store={store} />);
    expect(wrapper.length).toBe(1);
  });
});
