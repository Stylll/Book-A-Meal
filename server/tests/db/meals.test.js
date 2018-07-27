import 'babel-polyfill';
import { expect } from 'chai';
import {
  validMeal1,
  validMeal2,
  existingMeal,
  invalidMeal,
  insertSeedMeal,
  clearMeals,
} from '../../utils/seeders/mealSeeder';
import {
  existingUser,
  insertSeedUsers,
  clearUsers,
} from '../../utils/seeders/userSeeder';
import meals from '../../db/meals';


/* eslint-disable no-undef */
describe('Test suite for meals model', () => {
  // insert a default user
  before(async () => {
    await clearUsers();
    await insertSeedUsers(existingUser);
  });

  beforeEach(async () => {
    await clearMeals();
    await insertSeedMeal(existingMeal);
  });

  it('should require a meal name', async () => {
    const result = await meals.add({
      name: invalidMeal.name,
    });
    expect(result.err.message).to.equal('Meal name is required');
  });

  it('should require a unique meal name', async () => {
    const result = await meals.add(existingMeal);
    expect(result.err.message).to.equal('Meal name already exists');
  });

  it('should require price', async () => {
    const result = await meals.add({
      name: validMeal1.name,
    });
    expect(result.err.message).to.equal('Price is required');
  });

  it('should not allow price in invalid format', async () => {
    const result = await meals.add({
      name: validMeal1.name,
      price: 'three zero',
    });
    expect(result.err.message).to.equal('Price is invalid');
  });

  it('should require price to be greater than one', async () => {
    const result = await meals.add({
      name: validMeal1.name,
      price: 1,
    });
    expect(result.err.message).to.equal('Price must be greater than 1');
  });

  it('should require image link', async () => {
    const result = await meals.add({
      name: validMeal1.name,
      price: validMeal1.price,
      image: invalidMeal.image,
    });
    expect(result.err.message).to.equal('Image link is required');
  });

  it('should require user id', async () => {
    const result = await meals.add({
      name: validMeal1.name,
      price: validMeal1.price,
      image: validMeal1.image,
    });
    expect(result.err.message).to.equal('User id is required');
  });

  it('should add new meal', async () => {
    const result = await meals.add(validMeal1);
    expect(result.name).to.equal(validMeal1.name);
    expect(result.price).to.equal(validMeal1.price);
    expect(result.image).to.equal(validMeal1.image);
  });

  it('should update a meal', async () => {
    const updateMeal = {
      id: 1,
      name: 'New name',
      price: 2500.99,
      image: 'https://dummy.img',
    };

    const result = await meals.update(updateMeal);
    expect(result.name).to.equal(updateMeal.name);
    expect(result.price).to.equal(updateMeal.price);
    expect(result.image).to.equal(updateMeal.image);
  });

  it('should not update meal that does not exist', async () => {
    validMeal2.id = 10;
    validMeal2.name = 'Curry Rice';
    const result = await meals.update(validMeal2);
    expect(result.err.message).to.equal('Meal does not exist');
  });


  it('should delete meal', async () => {
    await meals.delete(1);
    const result = await meals.get(1);
    expect(result).to.equal(undefined);
  });

  it('should get all meals', async () => {
    await meals.add(validMeal1);
    const result = await meals.getAll();
    expect(result.meals.length).to.equal(2);
  });

  it('should get meal by name', async () => {
    const result = await meals.getByName(existingMeal.name);
    expect(result.meals[0].name).to.equal(existingMeal.name);
  });

  it('should truncate meal db', async () => {
    await meals.truncate();
    const result = await meals.getAll();
    expect(result.meals).to.be.an('array');
    expect(result.meals.length).to.equal(0);
  });
});
