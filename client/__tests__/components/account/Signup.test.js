import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';
import ConnectedSignup, { Signup } from '../../../src/components/account/Signup';
import { validUser } from '../../helpers/mockUsers';

jest.mock('../../../src/components/Main');

/**
 * ReactRouterEnzymeContext is used to mock the react router for enzyme testing.
 * module gotten from npm.
 */
const options = new ReactRouterEnzymeContext();

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({
  auth: {
    isAuthenticated: false,
    isCaterer: false,
    errors: {},
  },
});

const setup = (isAuthenticated = false, isCaterer = false) => {
  const props = {
    isAuthenticated,
    isCaterer,
    errors: {},
    actions: {
      signup: () => (Promise.resolve()),
    },
  };

  return shallow(<Signup {...props} />);
};

describe('Test Suite for Signup component', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('.overall').length).toBe(1);
    expect(wrapper.find('.title').length).toBe(1);
    expect(wrapper.find('.title').text()).toBe('Book-A-Meal');
    expect(wrapper.find('.signup-content').length).toBe(1);
    expect(wrapper.find('TextInput').length).toBe(4);
    expect(wrapper.find('select').length).toBe(1);
    expect(wrapper.find('input').last().prop('type')).toBe('button');
  });

  it('should not render if user is authenticated', () => {
    const wrapper = setup(true, true);
    expect(wrapper.find('.signup-content').length).toBe(0);
  });

  it('should change state on textinput change', () => {
    const wrapper = setup();
    const handleChangeSpy = jest.spyOn(wrapper.instance(), 'handleChange');
    const event = {
      preventDefault: jest.fn(),
      target: { name: 'email', value: 'step' },
    };
    wrapper.instance().handleChange(event);
    expect(wrapper.state().email).toBe('step');
    expect(handleChangeSpy).toHaveBeenCalled();
  });

  it('should call handle submit and signup function', () => {
    const wrapper = setup();
    const handleSubmitSpy = jest.spyOn(wrapper.instance(), 'handleSubmit');
    const event = {
      preventDefault: jest.fn(),
    };
    wrapper.instance().handleSubmit(event);
    expect(handleSubmitSpy).toHaveBeenCalled();
  });

  it('should update validation errors in the state', () => {
    const wrapper = setup();
    const event = {
      preventDefault: jest.fn(),
    };
    const button = wrapper.find('input').last();
    button.simulate('click', event);
    expect(wrapper.state().errors.email).toBe('Email is required');
    expect(wrapper.state().errors.username).toBe('Username is required');
    expect(wrapper.state().errors.password).toBe('Password is required');
  });

  it('should render connected Signup component', () => {
    const props = {};
    const wrapper = shallow(<ConnectedSignup {...props} store={store} />);
    expect(wrapper.length).toBe(1);
  });

  it('should call signup with valid input', () => {
    const wrapper = setup();
    const signupSpy = jest.spyOn(wrapper.instance().props.actions, 'signup');
    wrapper.setState({
      email: validUser.email,
      username: validUser.username,
      password: validUser.password,
      confirmPassword: validUser.confirmPassword,
      accountType: validUser.accountType,
    });
    const event = {
      preventDefault: jest.fn(),
    };
    const button = wrapper.find('input').last();
    button.simulate('click', event);
    expect(signupSpy).toHaveBeenCalled();
  });
});