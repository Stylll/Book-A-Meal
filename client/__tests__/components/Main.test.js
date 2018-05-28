import React from 'react';
import { expect } from 'chai';
import { shallow, render } from 'enzyme';
import { Main } from '../../src/components/Main';

let props;

const setup = () => shallow(<Main> <div><h1>Hello</h1> </div> </Main>);

describe('Test Suite for Main component', () => {
  it('should render properly', () => {
    const wrapper = setup();
    expect(wrapper.find('div').length).to.equal(2);
    expect(wrapper.find('NavBar').length).to.equal(1);
  });
});