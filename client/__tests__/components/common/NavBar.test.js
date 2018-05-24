import React from 'react';
import { expect } from 'chai';
import { shallow, render } from 'enzyme';
import NavBar from '../../../src/components/common/NavBar';

let props;

const setup = () => shallow(<NavBar />);

describe('Test Suite for NavBar component', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('NavLink').length).to.equal(3);
  });
});