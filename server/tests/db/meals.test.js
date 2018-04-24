import { expect } from 'chai';
import {
  validMeal1,
  validMeal2,
  existingMeal,
  invalidMeal,
  insertSeedMeal,
  clearMeals,
} from '../../utils/seeders/mealSeeder';
import meals from '../../db/meals';

/* eslint-disable no-undef */
describe('Test suite for meals model', () => {
  beforeEach(() => {
    clearMeals();
    insertSeedMeal(existingMeal);
  });

  it('should require a meal name', () => {
    const result = meals.add({ name: invalidMeal.name });
    expect(result.err.message).to.equal('Meal name is required');
  });

  it('should require a unique meal name', () => {
    const result = meals.add(existingMeal);
    expect(result.err.message).to.equal('Meal name already exists');
  });

  it('should require price', () => {
    const result = meals.add({ name: validMeal1.name });
    expect(result.err.message).to.equal('Price is required');
  });

  it('should not allow price in invalid format', () => {
    const result = meals.add({ name: validMeal1.name, price: 'three zero' });
    expect(result.err.message).to.equal('Price is invalid');
  });

  it('should require price to be greater than one', () => {
    const result = meals.add({ name: validMeal1.name, price: 1 });
    expect(result.err.message).to.equal('Price must be greater than 1');
  });

  it('should require image link', () => {
    const result = meals.add({
      name: validMeal1.name, price: validMeal1.price, image: invalidMeal.image,
    });
    expect(result.err.message).to.equal('Image link is required');
  });

  it('should add new meal', () => {
    const result = meals.add(validMeal1);
    expect(result.name).to.equal(validMeal1.name);
    expect(result.price).to.equal(validMeal1.price);
    expect(result.image).to.equal(validMeal1.image);
  });

  it('should add bulk meal', () => {
    meals.addBulk([validMeal1, validMeal2]);
    expect(meals.getAll().length).to.equal(3);
  });

  it('should update a meal', () => {
    existingMeal.id = 1;
    existingMeal.name = 'New name';
    existingMeal.price = 2500.99;
    existingMeal.image = 'https://dummy.img';
    const result = meals.update(existingMeal);
    expect(result.name).to.equal(existingMeal.name);
    expect(result.price).to.equal(existingMeal.price);
    expect(result.image).to.equal(existingMeal.image);
  });

  it('should not update same meal name', () => {
    existingMeal.id = 1;
    existingMeal.name = existingMeal.name;
    const result = meals.update(existingMeal);
    expect(result.err.message).to.equal('Meal name already exists');
  });

  it('should not update meal that does not exist', () => {
    validMeal2.id = 10;
    validMeal2.name = 'Curry Rice';
    const result = meals.update(validMeal2);
    expect(result.err.message).to.equal('Meal does not exist');
  });


  it('should delete meal', () => {
    meals.delete(1);
    expect(meals.get(1)).to.equal(null);
  });

  it('should get all meals', () => {
    meals.add(validMeal1);
    expect(meals.getAll().length).to.equal(2);
  });

  it('should get meal by name', () => {
    const result = meals.getByName(existingMeal.name);
    expect(result.name).to.equal(existingMeal.name);
  });

  it('should truncate meal db', () => {
    meals.truncate();
    expect(meals.getAll().length).to.equal(0);
  });
});
