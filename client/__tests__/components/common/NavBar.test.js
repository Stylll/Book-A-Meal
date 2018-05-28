import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';
import NavBar from '../../../src/components/common/NavBar';

const options = new ReactRouterEnzymeContext();

const setup = (isAuthenticated = false, isCaterer = false) => {
  const props = {
    user: {
      email: 'jason.bond@cia.com',
      username: 'Jason Bond',
    },
    isAuthenticated,
    isCaterer,
    logout: jest.fn(),
    expandNav: jest.fn(),
    toggleNav: jest.fn(),
  };
  return shallow(<NavBar {...props} />);
};

describe('Test Suite for NavBar component', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('NavLink').length).to.equal(22);
    expect(wrapper.find('a').length).to.equal(6);
  });
});