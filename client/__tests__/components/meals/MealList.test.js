import React from 'react';
import { shallow } from 'enzyme';
import MealList from '../../../src/components/meals/MealList';
import { saveMealResponse } from '../../helpers/mockMeals';

window.scrollTo = jest.fn();

const meals = [
  saveMealResponse.meal, saveMealResponse.meal, saveMealResponse.meal,
  saveMealResponse.meal, saveMealResponse.meal, saveMealResponse.meal,
  saveMealResponse.meal, saveMealResponse.meal, saveMealResponse.meal,
  saveMealResponse.meal, saveMealResponse.meal, saveMealResponse.meal,
];
const setup = () => {
  const props = {
    meals,
    handleDelete: () => Promise.resolve(),
    perPage: 4,
  };
  return shallow(<MealList {...props} />);
};

describe('Test suite for Meal List', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('.card-container').length).toBe(1);
    expect(wrapper.find('MealItem').length).toBe(4);
    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.state().pageCount).toBe(3);
  });

  it('should update pageNo in state when handlePageChange is called', () => {
    const wrapper = setup();
    wrapper.instance().handlePageChange({ selected: 1 });
    expect(wrapper.state().pageNo).toBe(2);
  });

  it('should display no results found when meal list is empty', () => {
    /* eslint-disable react/jsx-no-bind */
    const wrapper =
    shallow(<MealList meals={[]} perPage={4} handleDelete={() => Promise.resolve()} />);
    expect(wrapper.find('.card-container').length).toBe(0);
    expect(wrapper.find('MealItem').length).toBe(0);
    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.find('ReactPaginate').length).toBe(0);
    expect(wrapper.find('h3').first().text()).toBe('No Records Found');
    expect(wrapper.state().pageCount).toBe(0);
  });
});
