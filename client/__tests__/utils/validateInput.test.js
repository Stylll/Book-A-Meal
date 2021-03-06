import { expect } from 'chai';
import {
  validateSignupInput, validateSigninInput,
  validateMealInput, validateMenuInput,
} from '../../src/utils/validateInput';
import {
  emptyUser,
  validUser,
  invalidUser,
  unmatchingUserPassword,
} from '../helpers/mockUsers';
import {
  emptyMeal,
  invalidMeal,
  longMealName,
  validMeal,
} from '../helpers/mockMeals';
import {
  emptyMenu,
  invalidMenu,
  validMenu,
} from '../helpers/mockMenu';

describe('Test Suite for validateSignupInput function', () => {
  it('should return no errors when a valid input is passed', () => {
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

  it('should return errors when invalid input is passed', () => {
    const result = validateSignupInput(invalidUser);
    expect(result.isValid).to.equal(false);
    expect(result.errors.email).to.equal('Email is invalid');
    expect(result.errors.username).to.equal('Only A-Z a-z 0-9 _ - characters are allowed');
    expect(result.errors.password).to.equal('Password must have atleast 6 characters');
  });

  it('should return errors when unmatching passwords are passed', () => {
    const result = validateSignupInput(unmatchingUserPassword);
    expect(result.isValid).to.equal(false);
    expect(result.errors.password).to.equal('Passwords dont match');
    expect(result.errors.confirmPassword).to.equal('Passwords dont match');
  });
});

describe('Test suite for validateSigninInput function', () => {
  it('should return errors when empty fields are passed', () => {
    const result = validateSigninInput(emptyUser);
    expect(result.isValid).to.equal(false);
    expect(result.errors.email).to.equal('Email is required');
    expect(result.errors.password).to.equal('Password is required');
  });

  it('should return error when an invalid email is passed', () => {
    const result = validateSigninInput(invalidUser);
    expect(result.isValid).to.equal(false);
    expect(result.errors.email).to.equal('Email is invalid');
  });
});

describe('Test suite for validateMealInput function', () => {
  it('should return errors when empty fields are passed', () => {
    const result = validateMealInput(emptyMeal);
    expect(result.isValid).to.equal(false);
    expect(result.errors.name).to.equal('Meal name is required');
    expect(result.errors.price).to.equal('Price is required');
  });

  it('should not allow meal name of more than 50 characters', () => {
    const result = validateMealInput(longMealName);
    expect(result.isValid).to.equal(false);
    expect(result.errors.name).to.equal('Meal name should not be more than 50 characters');
  });

  it('should return errors when invalid input is passed', () => {
    const result = validateMealInput(invalidMeal);
    expect(result.isValid).to.equal(false);
    expect(result.errors.name).to.equal('Meal name can only contain alphanumeric characters');
    expect(result.errors.price).to.equal('Price is invalid');
  });

  it('meal price should be more than 1', () => {
    const result = validateMealInput({ ...validMeal, price: '0' });
    expect(result.isValid).to.equal(false);
    expect(result.errors.price).to.equal('Price must be at least 1');
  });

  it('should not return an error when a valid input is passed', () => {
    const result = validateMealInput({ ...validMeal });
    expect(result.isValid).to.equal(true);
  });

  describe('Test suite for validateMenuInput function', () => {
    it('should return error when an empty input is passed', () => {
      const result = validateMenuInput({ ...emptyMenu });
      expect(result.isValid).to.equal(false);
      expect(result.errors.mealIds).to.equal('Meal options cannot be empty');
    });

    it('should return error when an invalid input is passed', () => {
      const result = validateMenuInput({ ...invalidMenu });
      expect(result.isValid).to.equal(false);
      expect(result.errors.mealIds).to.equal('One or more of the meal options are invalid');
    });

    it('should return no error when a valid input is passed', () => {
      const result = validateMenuInput({ ...validMenu });
      expect(result.isValid).to.equal(true);
    });
  });
});
