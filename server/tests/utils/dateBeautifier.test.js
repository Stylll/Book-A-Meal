import { expect } from 'chai';
import {
  getCurrentDate,
  beautifyDate,
  getNormalDate,
} from '../../utils/dateBeautifier';

/**
 * Test for for dateBeautifier
 */

describe('Test suite for entry server file', () => {
  it('should return current date', () => {
    expect(getCurrentDate().toDateString()).to.equal(new Date().toDateString());
  });

  it('should return null if invalid date is supplied to beautifyDate', () => {
    expect(beautifyDate('asb')).to.equal(null);
  });

  it('should return beautified date', () => {
    expect(beautifyDate('2018-04-27')).to.equal('Friday, 27 April 2018');
  });

  it('should convert date to normal string', () => {
    expect(getNormalDate(new Date('2018-04-27'))).to.equal('2018-04-27');
  });

  it('should return null if invalid date is supplied to getNormalDate', () => {
    expect(getNormalDate('asb')).to.equal(null);
  });
});
