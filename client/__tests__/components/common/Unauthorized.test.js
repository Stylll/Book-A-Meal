import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Unauthorized from '../../../src/components/common/Unauthorized';

const setup = () => shallow(<Unauthorized />);

describe('Test Suite for NotFound component', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('div').length).to.equal(1);
    expect(wrapper.find('h3').length).to.equal(1);
    expect(wrapper.find('img').length).to.equal(1);
    expect(wrapper.find('NavLink').length).to.equal(1);
    expect(wrapper.find('br').length).to.equal(7);
  });
});
