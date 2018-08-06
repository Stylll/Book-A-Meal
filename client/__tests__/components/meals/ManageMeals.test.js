import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ConnectedManageMeal, { ManageMeals } from '../../../src/components/meals/ManageMeals';
import { saveMealResponse } from '../../helpers/mockMeals';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({
  meals: {
    meals: [],
    errors: {},
  },
});

const setup = () => {
  const meals = [
    saveMealResponse.meal, saveMealResponse.meal, saveMealResponse.meal,
    saveMealResponse.meal, saveMealResponse.meal, saveMealResponse.meal,
    saveMealResponse.meal, saveMealResponse.meal, saveMealResponse.meal,
    saveMealResponse.meal, saveMealResponse.meal, saveMealResponse.meal,
  ];
  const props = {
    meals,
    handleDelete: () => Promise.resolve(),
    actions: {
      deleteMeal: () => Promise.resolve(),
      getMeals: () => Promise.resolve(),
    },
    deleteItem: () => Promise.resolve(),
    pageSize: 8,
  };
  return shallow(<ManageMeals {...props} />);
}

describe('Test Suite for Manage Meal', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('div').length).toBe(3);
    expect(wrapper.find('MealList').length).toBe(1);
  });

  it('should render connected components properly', () => {
    const props = {};
    const wrapper = shallow(<ConnectedManageMeal {...props} store={store} />);
    expect(wrapper.length).toBe(1);
  });

  it('should call handleDelete and return delete modal', () => {
    const wrapper = setup();
    const deleteMealSpy = jest.spyOn(wrapper.instance().props.actions, 'deleteMeal');
    const event = {
      preventDefault: jest.fn(),
    };
    const result = wrapper.instance().handleDelete(event, saveMealResponse.meal.id);
  });

  it('should call deleteItem and call deleteMeal action', () => {
    const wrapper = setup();
    const deleteMealSpy = jest.spyOn(wrapper.instance().props.actions, 'deleteMeal');
    wrapper.instance().deleteItem(saveMealResponse.meal.id);
    expect(deleteMealSpy).toHaveBeenCalled();
  });
});
