import { expect } from 'chai';

import generateId from '../../utils/generateId';

/* eslint-disable no-undef */
describe('Test Suite for generateId function', () => {
  it('should return id of 1 for empty array', () => {
    const result = generateId([]);
    expect(result).to.equal(1);
  });

  it('should return 0 for object arguments', () => {
    const result = generateId({ id: 5 });
    expect(result).to.equal(0);
  });

  it('should return 0 for integer arguments', () => {
    const result = generateId(4);
    expect(result).to.equal(0);
  });

  it('should return 0 for string arguments', () => {
    const result = generateId('word');
    expect(result).to.equal(0);
  });

  it('should return id of 12', () => {
    const result = generateId([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(result).to.equal(12);
  });
});
