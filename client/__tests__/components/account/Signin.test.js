import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';
import ConnectedSignin, { Signin } from '../../../src/components/account/Signin';
import { validUser, emptyUser, invalidUser } from '../../helpers/mockUsers';

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
      signin: () => (Promise.resolve()),
    },
  };

  return shallow(<Signin {...props} />);
};

describe('Test suite for Signin component', () => {
  it('should render unconnected component properly', () => {
    const wrapper = setup();
    expect(wrapper.find('.signin-overall').length).toBe(1);
    expect(wrapper.find('.title').length).toBe(1);
    expect(wrapper.find('.title').text()).toBe('Book-A-Meal');
    expect(wrapper.find('.signin-content').length).toBe(1);
    expect(wrapper.find('TextInput').length).toBe(2);
    expect(wrapper.find('NavLink').length).toBe(2);
    expect(wrapper.find('input').last().prop('type')).toBe('button');
  });

  it('should not render if user is authenticated', () => {
    const wrapper = setup(true, true);
    expect(wrapper.find('.signin-content').length).toBe(0);
  });

  it('should handleChange and update state', () => {
    const wrapper = setup();
    const handleChangeSpy = jest.spyOn(wrapper.instance(), 'handleChange');
    const event = {
      preventDefault: jest.fn(),
      target: {
        name: 'email',
        value: 'step',
      },
    };
    wrapper.instance().handleChange(event);
    expect(wrapper.state().email).toBe('step');
    expect(handleChangeSpy).toHaveBeenCalled();
  });

  it('should update state with error messages for invalid input', () => {
    const wrapper = setup();
    wrapper.setState({
      email: emptyUser.email,
      password: emptyUser.password,
    });
    const submitButton = wrapper.find('input').last();
    const event = {
      preventDefault: jest.fn(),
    };
    submitButton.simulate('click', event);
    expect(wrapper.state().errors.email).toBe('Email is required');
    expect(wrapper.state().errors.password).toBe('Password is required');
  });

  it('should return error for invalid email', () => {
    const wrapper = setup();
    wrapper.setState({
      email: invalidUser.email,
      password: validUser.password,
    });
    const submitButton = wrapper.find('input').last();
    const event = {
      preventDefault: jest.fn(),
    };
    submitButton.simulate('click', event);
    expect(wrapper.state().errors.email).toBe('Email is invalid');
  });

  it('should handleSubmit and call signin action', () => {
    const wrapper = setup();
    wrapper.setState({
      email: validUser.email,
      password: validUser.password,
    });
    const handleSubmitSpy = jest.spyOn(wrapper.instance(), 'handleSubmit');
    const signinSpy = jest.spyOn(wrapper.instance().props.actions, 'signin');
    const event = {
      preventDefault: jest.fn(),
    };
    wrapper.instance().handleSubmit(event);
    expect(handleSubmitSpy).toHaveBeenCalled();
    expect(signinSpy).toHaveBeenCalled();
  });

  it('should render connected component properly', () => {
    const props = {};
    const wrapper = shallow(<ConnectedSignin {...props} store={store} />);
    expect(wrapper.length).toBe(1);
  });
})
