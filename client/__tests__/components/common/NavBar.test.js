import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
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
  };
  return shallow(<NavBar {...props} />);
};

const mountSetup = (isAuthenticated = false, isCaterer = false) => {
  const props = {
    user: {
      email: 'jason.bond@cia.com',
      username: 'Jason Bond',
    },
    isAuthenticated,
    isCaterer,
    logout: jest.fn(),
    expandNav: jest.fn(),
  };
  return mount(<Router><NavBar {...props} /></Router>);
};

describe('Test Suite for NavBar component', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('NavLink').length).to.equal(21);
    expect(wrapper.find('a').length).to.equal(5);
  });

  it('should only display menu links for caterer when user is a caterer', () => {
    const wrapper = mountSetup(true, true);
    expect(wrapper.find('a').length).to.equal(13);
    expect(wrapper.find('a').get(0).props.children).to.equal('Book-A-Meal');
    expect(wrapper.find('a').get(1).props.children).to.equal('Menus');
    expect(wrapper.find('a').get(2).props.children).to.equal('Meals');
    expect(wrapper.find('a').get(3).props.children).to.equal('New Meal');
    expect(wrapper.find('a').get(4).props.children).to.equal('Manage Meals');
    expect(wrapper.find('a').get(5).props.children).to.equal('Orders');
    expect(wrapper.find('a').get(6).props.children).to.equal('Pending Orders');
    expect(wrapper.find('a').get(7).props.children).to.equal('Order History');
    expect(wrapper.find('a').get(8).props.children).to.equal('Order Summary');
    expect(wrapper.find('a').get(9).props.children).to.deep.equal(['Welcome, ', 'Jason Bond']);
    expect(wrapper.find('a').get(10).props.children).to.equal('My Profile');
    expect(wrapper.find('a').get(11).props.children).to.equal('Logout');
  });

  it('should only display menu links for customer when user is a customer', () => {
    const wrapper = mountSetup(true);
    expect(wrapper.find('a').length).to.equal(9);
    expect(wrapper.find('a').get(0).props.children).to.equal('Book-A-Meal');
    expect(wrapper.find('a').get(1).props.children).to.equal('View Menu');
    expect(wrapper.find('a').get(2).props.children).to.equal('Orders');
    expect(wrapper.find('a').get(3).props.children).to.equal('Pending Orders');
    expect(wrapper.find('a').get(4).props.children).to.equal('Order History');
    expect(wrapper.find('a').get(5).props.children).to.deep.equal(['Welcome, ', 'Jason Bond']);
    expect(wrapper.find('a').get(6).props.children).to.equal('My Profile');
    expect(wrapper.find('a').get(7).props.children).to.equal('Logout');
  });

  it('should only display sign in and sign up link when user is a guest', () => {
    const wrapper = mountSetup();
    expect(wrapper.find('a').length).to.equal(4);
    expect(wrapper.find('a').get(0).props.children).to.equal('Book-A-Meal');
    expect(wrapper.find('a').get(1).props.children).to.equal('Sign In');
    expect(wrapper.find('a').get(2).props.children).to.equal('Sign Up');
  });
});
