import { expect } from 'chai';
import 'babel-polyfill';
import orders from '../../db/orders';
import {
  validOrder1,
  validOrder2,
  invalidOrder,
  existingOrder,
  insertSeedOrder,
  clearOrders,
} from '../../utils/seeders/orderSeeder';
import {
  existingMeal,
  clearMeals,
  insertSeedMeal,
} from '../../utils/seeders/mealSeeder';

/* eslint-disable no-undef */

describe('Test Suite for orders', () => {
  // before each function to add required data
  beforeEach(async () => {
    await clearMeals();
    await clearOrders();
    await insertSeedMeal(existingMeal);
    await insertSeedOrder(existingOrder);
  });

  it('should require meal id', async () => {
    const result = await orders.add({ ...invalidOrder, mealId: 0 });
    expect(result.err.message).to.equal('Meal id is required');
  });

  it('should require a valid meal id', async () => {
    const result = await orders.add({ ...invalidOrder, mealId: 'abc' });
    expect(result.err.message).to.equal('Meal id is invalid');
  });

  it('should require an existing meal', async () => {
    const result = await orders.add({ ...validOrder2, mealId: 3 });
    expect(result.err.message).to.equal('Meal does not exist');
  });

  it('should require price', async () => {
    const result = await orders.add({ ...validOrder1, price: 0 });
    expect(result.err.message).to.equal('Price is required');
  });

  it('should require a valid price', async () => {
    const result = await orders.add({ ...validOrder1, price: 'abc' });
    expect(result.err.message).to.equal('Price is invalid');
  });

  it('should ensure price is above 1', async () => {
    const result = await orders.add({ ...validOrder1, price: 1 });
    expect(result.err.message).to.equal('Price must be greater than one');
  });

  it('should require quantity', async () => {
    const result = await orders.add({ ...validOrder1, quantity: 0 });
    expect(result.err.message).to.equal('Quantity is required');
  });

  it('should require a valid quantity', async () => {
    const result = await orders.add({ ...validOrder1, quantity: 'abs' });
    expect(result.err.message).to.equal('Quantity is invalid');
  });

  it('should add, set default status to pending and calculate cost', async () => {
    const result = await orders.add({ ...validOrder2, status: '' });
    expect(result.id).to.equal(2);
    expect(result.mealId).to.equal(validOrder2.mealId);
    expect(result.price).to.equal(validOrder2.price);
    expect(result.quantity).to.equal(validOrder2.quantity);
    expect(result.cost).to.equal(validOrder2.price * validOrder2.quantity);
    expect(result.status).to.equal('pending');
    expect(result).to.haveOwnProperty('createdAt');
    expect(result).to.haveOwnProperty('updatedAt');
    expect(result).to.haveOwnProperty('userId');
  });

  it('should require user id', async () => {
    const result = await orders.add({ ...validOrder1, userId: 0 });
    expect(result.err.message).to.equal('User id is required');
  });

  it('should require a valid user id', async () => {
    const result = await orders.add({ ...validOrder1, userId: 'abc' });
    expect(result.err.message).to.equal('User id is invalid');
  });

  it('should require order id when updating', async () => {
    const result = await orders.update({ ...existingOrder, id: 0 });
    expect(result.err.message).to.equal('Order id is required');
  });

  it('should require a valid order id when updating', async () => {
    const result = await orders.update({ ...existingOrder, id: 'abc' });
    expect(result.err.message).to.equal('Order id is invalid');
  });

  it('should require an existing order id when updating', async () => {
    const result = await orders.update({ ...existingOrder, id: 99 });
    expect(result.err.message).to.equal('Order does not exist');
  });

  it('should require an existing meal if provided when updating', async () => {
    const result = await orders.update({ ...existingOrder, mealId: 99, id: 1 });
    expect(result.err.message).to.equal('Meal does not exist');
  });

  it('should require a valid price if provided when updating', async () => {
    const result = await orders.update({ ...existingOrder, price: 'abc', id: 1 });
    expect(result.err.message).to.equal('Price is invalid');
  });

  it('should ensure price is above 1 if provided when updating', async () => {
    const result = await orders.update({ ...existingOrder, price: 1, id: 1 });
    expect(result.err.message).to.equal('Price must be greater than one');
  });

  it('should require a valid quantity if provided when updating', async () => {
    const result = await orders.update({ ...existingOrder, quantity: 'abc', id: 1 });
    expect(result.err.message).to.equal('Quantity is invalid');
  });

  it('should require a valid status if provided when updating', async () => {
    const result = await orders.update({ ...existingOrder, status: 'abc', id: 1 });
    expect(result.err.message).to.equal('Status is invalid');
  });

  it('should delete a valid order', async () => {
    await orders.delete(1);
    const result = await orders.get(1);
    expect(result).to.equal(undefined);
  });

  it('should return an array of orders', async () => {
    const result = await orders.getAll();
    expect(result).to.be.an('array');
    expect(result[0].mealId).to.equal(existingOrder.mealId);
    expect(result[0].price).to.equal(existingOrder.price);
    expect(result[0].quantity).to.equal(existingOrder.quantity);
  });

  it('should get order by valid order id', async () => {
    const result = await orders.get(1);
    expect(result.id).to.equal(1);
    expect(result.mealId).to.equal(existingOrder.mealId);
    expect(result.price).to.equal(existingOrder.price);
    expect(result.quantity).to.equal(existingOrder.quantity);
    expect(result.cost).to.equal(existingOrder.price * existingOrder.quantity);
    expect(result.status).to.equal('pending');
    expect(result).to.haveOwnProperty('createdAt');
    expect(result).to.haveOwnProperty('updatedAt');
    expect(result).to.haveOwnProperty('userId');
  });

  it('should return null when getting order by invalid id', async () => {
    const result = await orders.get('abc');
    expect(result).to.equal(null);
  });

  it('should return undefined when getting order that does not exist', async () => {
    const result = await orders.get(99);
    expect(result).to.equal(undefined);
  });

  it('should get array of orders by meal id', async () => {
    const result = await orders.getByMealId(1);
    expect(result).to.be.an('array');
  });

  it('should get array of orders by status', async () => {
    const result = await orders.getByStatus('pending');
    expect(result).to.be.an('array');
  });

  it('should get array of orders by user id', async () => {
    const result = await orders.getByUserId(1);
    expect(result).to.be.an('array');
  });

  it('should truncate orders in the db', async () => {
    await orders.truncate();
    const result = await orders.getAll();
    expect(result).to.be.an('array');
    expect(result.length).to.equal(0);
  });
});
