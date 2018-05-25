import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Index from '../../src/components/Index';

describe('Index page component', () => {
  it('should load page with required information', () => {
    const wrapper = shallow(<Index />);
    expect(wrapper.find('.title').length).to.equal(1);
    expect(wrapper.find('.title').text()).to.equal('Book-A-Meal');
    expect(wrapper.find('NavLink').length).to.equal(2);
    expect(wrapper.find('.sub-text').length).to.equal(1);
    expect(wrapper.find('.normal-text').length).to.equal(2);
  });
});