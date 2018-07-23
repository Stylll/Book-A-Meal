import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';
import ConnectedEditMeal, { EditMeal } from '../../../src/components/meals/EditMeal';
import { validMeal, emptyMeal, invalidMeal } from '../../helpers/mockMeals';
import { validateMealInput } from '../../../src/utils/validateInput';


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
    actions: {
      saveMeal: () => (Promise.resolve()),
    },
    errors: {},
    match: {
      params: {
        id: 0,
      },
    },
  };
  return shallow(<EditMeal {...props} />);
};

describe('Test suite for EditMeal Component', () => {
  it('should render unconnected component properly', () => {
    const wrapper = setup();
    expect(wrapper.find('TextInput').length).toBe(2);
    expect(wrapper.find('h1').first().text()).toBe('Add / Edit Meal');
    expect(wrapper.find('input').first().prop('type')).toBe('file');
    expect(wrapper.find('input').last().prop('type')).toBe('button');
    expect(wrapper.find('NavLink').length).toBe(1);
  });

  it('should render connected conponent properly', () => {
    const props = {};
    const wrapper = shallow(<ConnectedEditMeal {...props} store={store} />);
    expect(wrapper.length).toBe(1);
  });

  it('should return error messages for invalid input', () => {
    const wrapper = setup();
    wrapper.setState({
      ...invalidMeal,
    });
    const handleSubmitSpy = jest.spyOn(wrapper.instance(), 'handleSubmit');
    const event = {
      preventDefault: jest.fn(),
    };
    wrapper.instance().handleSubmit(event);
    const state = wrapper.state();
    expect(handleSubmitSpy).toHaveBeenCalled();
    expect(state.errors.name).toBe('Meal name can only contain alphanumeric characters');
    expect(state.errors.price).toBe('Price is invalid');
  });

  it('should return error messages for empty input', () => {
    const wrapper = setup();
    wrapper.setState({
      ...emptyMeal,
    });
    const handleSubmitSpy = jest.spyOn(wrapper.instance(), 'handleSubmit');
    const event = {
      preventDefault: jest.fn(),
    };
    wrapper.instance().handleSubmit(event);
    const state = wrapper.state();
    expect(handleSubmitSpy).toHaveBeenCalled();
    expect(state.errors.name).toBe('Meal name is required');
    expect(state.errors.price).toBe('Price is required');
  });

  it('should call handleChange and update state', () => {
    const wrapper = setup();
    const handleChangeSpy = jest.spyOn(wrapper.instance(), 'handleChange');
    const event = {
      preventDefault: jest.fn(),
      target: {
        name: 'name',
        value: 'Jollof',
      },
    };
    wrapper.instance().handleChange(event);
    const state = wrapper.state();
    expect(handleChangeSpy).toHaveBeenCalled();
    expect(state.name).toBe('Jollof');
  });

  it('should call handleSubmit and saveMeal action', () => {
    const wrapper = setup();
    const saveMealSpy = jest.spyOn(wrapper.instance().props.actions, 'saveMeal');
    wrapper.setState({
      ...validMeal,
    });
    const event = {
      preventDefault: jest.fn(),
    };
    const button = wrapper.find('input').last();
    button.simulate('click', event);
    expect(saveMealSpy).toHaveBeenCalled();
  });
});