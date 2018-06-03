import React from 'react';
import { shallow } from 'enzyme';
import MealItem from '../../../src/components/meals/MealItem';
import { saveMealResponse } from '../../helpers/mockMeals';

const setup = () => {
  const props = {
    meal: saveMealResponse.meal,
    handleDelete: () => Promise.resolve(),
  };
  return shallow(<MealItem {...props} />);
};

describe('Test suite for Meal Item', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('.card').length).toBe(1);
    expect(wrapper.find('.flex-display').length).toBe(1);
    expect(wrapper.find('.card-img-container').length).toBe(1);
    expect(wrapper.find('.card-content').length).toBe(1);
    expect(wrapper.find('h3').length).toBe(1);
    expect(wrapper.find('h3').first().text()).toBe(saveMealResponse.meal.name);
    expect(wrapper.find('h4').first().text()).toContain(saveMealResponse.meal.price);
    expect(wrapper.find('div').length).toBe(4);
    expect(wrapper.find('img').length).toBe(1);
    expect(wrapper.find('a').length).toBe(1);
    expect(wrapper.find('NavLink').length).toBe(1);
  });
});