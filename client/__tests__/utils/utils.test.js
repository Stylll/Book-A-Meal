import { expect } from 'chai';
import { getMessageValue } from '../../src/utils/utils';

describe('Test Suite for getMessageValue function', () => {
  const param = {
    email: {
      message: 'Email is required',
    },
    username: {
      message: 'Username is required',
    },
  };
  it('should return expected result when a parameter is passed', () => {
    const expectedResult = {
      email: 'Email is required',
      username: 'Username is required',
    };
    const result = getMessageValue(param);
    expect(result).to.eql(expectedResult);
  });

  it('should return empty object if parameter is an empty object', () => {
    const result = getMessageValue({});
    expect(result).to.eql({});
  });

  it('should return error message if an empty parameter is passed', () => {
    const result = getMessageValue();
    expect(result).to.equal('Argument cannot be empty');
  });

  it('should return error message if parameter is not an object', () => {
    const result = getMessageValue(23);
    expect(result).to.equal('Argument must be an object');
  });
});
