import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ConnectedViewMeals, { ViewMeals } from '../../../src/components/menu/ViewMeals';
import { getMenuResponse } from '../../helpers/mockMenu';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({
  meals: {
    meals: [],
    errors: {},
  },
  menus: {
    menus: [],
    errors: {},
  },
});

const setup = () => {
  const props = {
    match: {
      params: {
        id: 2,
      },
    },
    menus: getMenuResponse.menus,
    pageSize: 8,
  };
  return shallow(<ViewMeals {...props} />);
};

describe('Test Suite for View Menu Meals', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('div').length).toBe(1);
    expect(wrapper.find('MealList').length).toBe(1);
  });

  it('should render connected components properly', () => {
    const props = {};
    const wrapper = shallow(<ConnectedViewMeals {...props} store={store} />);
    expect(wrapper.length).toBe(1);
  });
});