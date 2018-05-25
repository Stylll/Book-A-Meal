import { expect } from 'chai';
import { validateSignupInput, validateSigninInput } from '../../src/utils/validateInput';
import {
  emptyUser,
  validUser,
  invalidUser,
  unmatchingUserPassword,
} from '../helpers/mockUsers';

describe('Test Suite for validateSignupInput function', () => {
  it('should return no errors for valid input', () => {
    const result = validateSignupInput(validUser);
    expect(result.errors).to.eql({});
    expect(result.isValid).to.equal(true);
  });

  it('should require all input', () => {
    const result = validateSignupInput(emptyUser);
    expect(result.isValid).to.equal(false);
    expect(result.errors.email).to.equal('Email is required');
    expect(result.errors.username).to.equal('Username is required');
    expect(result.errors.password).to.equal('Password is required');
  });

  it('should return errors for invalid input', () => {
    const result = validateSignupInput(invalidUser);
    expect(result.isValid).to.equal(false);
    expect(result.errors.email).to.equal('Email is invalid');
    expect(result.errors.username).to.equal('Only A-Z a-z 0-9 _ - characters are allowed');
    expect(result.errors.password).to.equal('Password must have atleast 6 characters');
  });

  it('should return errors for unmatching passwords', () => {
    const result = validateSignupInput(unmatchingUserPassword);
    expect(result.isValid).to.equal(false);
    expect(result.errors.password).to.equal('Passwords dont match');
    expect(result.errors.confirmPassword).to.equal('Passwords dont match');
  });
});

describe('Test suite for validateSigninInput function', () => {
  it('should return errors for empty fields', () => {
    const result = validateSigninInput(emptyUser);
    expect(result.isValid).to.equal(false);
    expect(result.errors.email).to.equal('Email is required');
    expect(result.errors.password).to.equal('Password is required');
  });

  it('should return error for invalid email', () => {
    const result = validateSigninInput(invalidUser);
    expect(result.isValid).to.equal(false);
    expect(result.errors.email).to.equal('Email is invalid');
  });
});