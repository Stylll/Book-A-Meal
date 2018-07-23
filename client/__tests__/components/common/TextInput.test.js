import React from 'react';
import { expect } from 'chai';
import { shallow, render } from 'enzyme';
import TextInput from '../../../src/components/common/TextInput';

let props;

const setup = (error) => {
  props = {
    name: 'username',
    type: 'text',
    value: '',
    required: true,
    className: 'textbox',
    onChange: jest.fn(),
    error,
  };
  return render(<TextInput {...props} />);
};

describe('Test Suite for TextInput Component', () => {
  it('should render TextInput properly', () => {
    const wrapper = setup();
    expect(wrapper.find('div').length).to.equal(1);
    expect(wrapper.find('input').length).to.equal(1);
  });

  it('should display error span if error exists', () => {
    const wrapper = setup('Username is required');
    expect(wrapper.find('div').length).to.equal(1);
    expect(wrapper.find('input').length).to.equal(1);
    expect(wrapper.find('span').length).to.equal(1);
    expect(wrapper.find('span').text()).to.equal('Username is required');
  });
});