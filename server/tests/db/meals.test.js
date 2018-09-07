import 'babel-polyfill';
import { expect } from 'chai';
import {
  riceAndStew,
  crispyChicken,
  curryRice,
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
    await insertSeedMeal(curryRice);
  });

  it('should require a meal name', async () => {
    const result = await meals.add({
      name: invalidMeal.name,
    });
    expect(result.err.message).to.equal('Meal name is required');
  });

  it('should require price', async () => {
    const result = await meals.add({
      name: riceAndStew.name,
    });
    expect(result.err.message).to.equal('Price is required');
  });

  it('should not allow price in invalid format', async () => {
    const result = await meals.add({
      name: riceAndStew.name,
      price: 'three zero',
    });
    expect(result.err.message).to.equal('Price is invalid');
  });

  it('should require price to be atleast one', async () => {
    const result = await meals.add({
      name: riceAndStew.name,
      price: 0.8,
    });
    expect(result.err.message).to.equal('Price must be atleast one');
  });

  it('should require image link', async () => {
    const result = await meals.add({
      name: riceAndStew.name,
      price: riceAndStew.price,
      image: invalidMeal.image,
    });
    expect(result.err.message).to.equal('Image link is required');
  });

  it('should require user id', async () => {
    const result = await meals.add({
      name: riceAndStew.name,
      price: riceAndStew.price,
      image: riceAndStew.image,
    });
    expect(result.err.message).to.equal('User id is required');
  });

  it('should add new meal', async () => {
    const result = await meals.add(riceAndStew);
    expect(result.name).to.equal(riceAndStew.name);
    expect(result.price).to.equal(riceAndStew.price);
    expect(result.image).to.equal(riceAndStew.image);
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
    crispyChicken.id = 10;
    crispyChicken.name = 'Curry Rice';
    const result = await meals.update(crispyChicken);
    expect(result.err.message).to.equal('Meal does not exist');
  });


  it('should delete meal', async () => {
    await meals.delete(1);
    const result = await meals.get(1);
    expect(result).to.equal(undefined);
  });

  it('should get all meals', async () => {
    await meals.add(riceAndStew);
    const result = await meals.getAll();
    expect(result.meals.length).to.equal(2);
  });

  it('should get meal by name', async () => {
    const result = await meals.getByName(curryRice.name);
    expect(result.meals[0].name).to.equal(curryRice.name);
  });

  it('should truncate meal db', async () => {
    await meals.truncate();
    const result = await meals.getAll();
    expect(result.meals).to.be.an('array');
    expect(result.meals.length).to.equal(0);
  });
});
