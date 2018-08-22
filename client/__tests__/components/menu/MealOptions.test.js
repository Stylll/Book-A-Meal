import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ConnectedMealOptions, { MealOptions } from '../../../src/components/menu/MealOptions';
import { getMenuResponse } from '../../helpers/mockMenu';
import { getMealsResponse } from '../../helpers/mockMeals';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({
  meals: {
    meals: [],
    errors: {},
  },
});

const setup = () => {
  const props = {
    menu: getMenuResponse.menus[0],
    actions: {
      getMeals: () => (Promise.resolve),
    },
    meals: getMealsResponse.meals,
    updateOption: () => (Promise.resolve),
  };
  return shallow(<MealOptions {...props} />);
};

describe('Test suite for MealOptions component', () => {
  it('should render properly', () => {
    const wrapper = setup();
    wrapper.setState({
      displayResult: true,
      loading: false,
    });
    expect(wrapper.find('.searchDropdownContainer').length).toBe(1);
    expect(wrapper.find('div').length).toBe(5);
    expect(wrapper.find('input').length).toBe(1);
    expect(wrapper.find('.result').length).toBe(1);
    expect(wrapper.find('.item').length).toBe(2);
  });

  it('should render connected component', () => {
    const props = {
      menu: getMenuResponse.menus[0],
      actions: {
        getMeals: () => (Promise.resolve),
      },
      meals: getMealsResponse.meals,
      updateOption: () => (Promise.resolve),
    };
    const wrapper = shallow(<ConnectedMealOptions store={store} {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('should update state when handleChange is called', () => {
    const wrapper = setup();
    const handleChange = jest.spyOn(wrapper.instance(), 'handleChange');
    const event = {
      preventDefault: jest.fn(),
      target: {
        name: 'name',
        value: 'Rice',
      },
    };
    wrapper.instance().handleChange(event);
    expect(handleChange).toHaveBeenCalled();
    expect(wrapper.state().name).toEqual('Rice');
  });

  it('should update state when handleSelect is called', () => {
    const wrapper = setup();
    const handleSelect = jest.spyOn(wrapper.instance(), 'handleSelect');
    const event = {
      preventDefault: jest.fn(),
      target: {
        innerHTML: 'Rice and Beans',
      },
    };
    wrapper.instance().handleSelect(event);
    expect(handleSelect).toHaveBeenCalled();
    expect(wrapper.state().name).toEqual('Rice and Beans');
    expect(wrapper.state().displayResult).toEqual(false);
  });

  it('should update state when handleFocus is called', () => {
    const wrapper = setup();
    const handleFocus = jest.spyOn(wrapper.instance(), 'handleFocus');
    const event = {
      preventDefault: jest.fn(),
    };
    wrapper.instance().handleFocus(event);
    expect(handleFocus).toHaveBeenCalled();
    expect(wrapper.state().displayResult).toEqual(true);
  });
});
