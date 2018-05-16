import { expect } from 'chai';
import request from 'supertest';
import app from '../../server';
import Authenticate from '../../utils/authentication/authenticate';
import {
  existingUser,
  insertSeedUsers,
  validUser1,
  validUser2,
  adminUser,
  clearUsers,
} from '../../utils/seeders/userSeeder';
import {
  existingMeal,
  clearMeals,
  insertSeedMeal,
  validMeal1,
  validMeal2,
} from '../../utils/seeders/mealSeeder';
import {
  insertSeedMenu,
  currentMenu,
} from '../../utils/seeders/menuSeeder';
import {
  existingOrder,
  clearOrders,
  insertSeedOrder,
  validOrder1,
  validOrder2,
} from '../../utils/seeders/orderSeeder';
import Orders from '../../db/orders';

/* eslint-disable no-undef */
describe('Test Suite for Order Controller', () => {
  before(async () => {
    // create existing users
    await clearUsers();
    await insertSeedUsers(existingUser);
    await insertSeedUsers(validUser1);
    await insertSeedUsers(validUser2);
    await insertSeedUsers(adminUser);
  });

  // generate access token for users
  const catererToken = Authenticate.authenticateUser({ id: 1, ...existingUser });
  const customerToken = Authenticate.authenticateUser({ id: 2, ...validUser1 });
  const catererToken2 = Authenticate.authenticateUser({ id: 3, ...validUser2 });
  const adminToken = Authenticate.authenticateUser({ id: 4, ...adminUser });

  describe('POST: Create Order - /api/orders', () => {
    // before each hook to clean and insert data to the db
    beforeEach(async () => {
      await clearMeals();
      await clearOrders();
      await insertSeedMeal(existingMeal);
      await insertSeedMenu(currentMenu);
      await insertSeedMeal(validMeal1);
      await insertSeedMeal(validMeal2);
      await insertSeedOrder(existingOrder);
    });

    it('should require an authentication token', (done) => {
      request(app)
        .post('/api/v1/orders')
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body.message).to.equal('Authentication failed. No token provided');
          done();
        });
    });

    it('should require a valid authentication token', (done) => {
      request(app)
        .post('/api/v1/orders')
        .set({
          'x-access-token': 'rkrri444443223sdkd.rererer.weewewe3434',
        })
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body.message).to.equal('Token is invalid or has expired');
          done();
        });
    });

    it('should require a customer user account', (done) => {
      request(app)
        .post('/api/v1/orders')
        .set({
          'x-access-token': catererToken,
        })
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(403);
          expect(resp.body.message).to.equal('Unauthorized Access');
          done();
        });
    });

    it('should require a meal id', (done) => {
      request(app)
        .post('/api/v1/orders')
        .set({
          'x-access-token': customerToken,
        })
        .send({

        })
        .end((err, resp) => {
          expect(resp.body.errors.meal.statusCode).to.equal(400);
          expect(resp.body.errors.meal.message).to.equal('Meal id is required');
          done();
        });
    });

    it('should require an existing meal id', (done) => {
      request(app)
        .post('/api/v1/orders')
        .set({
          'x-access-token': customerToken,
        })
        .send({
          mealId: 99,
        })
        .end((err, resp) => {
          expect(resp.body.errors.meal.statusCode).to.equal(400);
          expect(resp.body.errors.meal.message).to.equal('Meal does not exist');
          done();
        });
    });

    it('should check if meal exists in the days menu', (done) => {
      request(app)
        .post('/api/v1/orders')
        .set({
          'x-access-token': customerToken,
        })
        .send({
          mealId: 3,
        })
        .end((err, resp) => {
          expect(resp.body.errors.meal.statusCode).to.equal(400);
          expect(resp.body.errors.meal.message).to.equal('Meal does not exist in menu');
          done();
        });
    });

    it('should require quantity', (done) => {
      request(app)
        .post('/api/v1/orders')
        .set({
          'x-access-token': customerToken,
        })
        .send({
          mealId: validOrder1.mealId,
          quantity: 0,
        })
        .end((err, resp) => {
          expect(resp.body.errors.quantity.statusCode).to.equal(400);
          expect(resp.body.errors.quantity.message).to.equal('Quantity is required');
          done();
        });
    });

    it('should require a valid quantity', (done) => {
      request(app)
        .post('/api/v1/orders')
        .set({
          'x-access-token': customerToken,
        })
        .send({
          mealId: validOrder1.mealId,
          quantity: 'abc',
        })
        .end((err, resp) => {
          expect(resp.body.errors.quantity.statusCode).to.equal(400);
          expect(resp.body.errors.quantity.message).to.equal('Quantity is invalid');
          done();
        });
    });

    it('should create order with default status as pending', (done) => {
      request(app)
        .post('/api/v1/orders')
        .set({
          'x-access-token': customerToken,
        })
        .send(validOrder1)
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          expect(resp.body.order).to.be.an('object');
          expect(resp.body.order.status).to.equal('pending');
          expect(resp.body.order.mealId).to.equal(validOrder1.mealId);
          expect(resp.body.order.price).to.equal(existingMeal.price);
          expect(resp.body.order.quantity).to.equal(validOrder1.quantity);
          expect(resp.body.order.cost).to.equal(existingMeal.price * validOrder1.quantity);
          done();
        });
    });

    it('should return proper response data and status code after creating', (done) => {
      request(app)
        .post('/api/v1/orders')
        .set({
          'x-access-token': customerToken,
        })
        .send(validOrder1)
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          expect(resp.body.order).to.be.an('object');
          expect(resp.body.order.id).to.equal(2);
          expect(resp.body.order.mealId).to.equal(validOrder1.mealId);
          expect(resp.body.order.price).to.equal(existingMeal.price);
          expect(resp.body.order.quantity).to.equal(validOrder1.quantity);
          expect(resp.body.order.status).to.equal('pending');
          expect(resp.body.order.userId).to.equal(2);
          expect(resp.body.order.cost).to.equal(existingMeal.price * validOrder1.quantity);
          expect(resp.body.order).to.haveOwnProperty('createdAt');
          expect(resp.body.order).to.haveOwnProperty('updatedAt');
          done();
        });
    });
  });

  describe('PUT: Update Order - /api/orders/:id', () => {
    // before each hook to clean and insert data to the db
    beforeEach(async () => {
      await clearMeals();
      await clearOrders();
      await insertSeedMeal(existingMeal);
      await insertSeedMeal(validMeal1);
      await insertSeedMenu(currentMenu);
      await insertSeedMeal(validMeal2);
      await insertSeedOrder({ ...existingOrder, userId: 2 });
      await insertSeedOrder({ ...validOrder1, userId: 3 });
    });

    it('should require an authentication token', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body.message).to.equal('Authentication failed. No token provided');
          done();
        });
    });

    it('should require a valid authentication token', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': 'rkrri444443223sdkd.rererer.weewewe3434',
        })
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body.message).to.equal('Token is invalid or has expired');
          done();
        });
    });

    it('should require a valid order id', (done) => {
      request(app)
        .put('/api/v1/orders/abc')
        .set({
          'x-access-token': customerToken,
        })
        .send({})
        .end((err, resp) => {
          expect(resp.body.errors.order.statusCode).to.equal(400);
          expect(resp.body.errors.order.message).to.equal('Order id is invalid');
          done();
        });
    });

    it('should require an existing order', (done) => {
      request(app)
        .put('/api/v1/orders/100')
        .set({
          'x-access-token': customerToken,
        })
        .send({})
        .end((err, resp) => {
          expect(resp.body.errors.order.statusCode).to.equal(400);
          expect(resp.body.errors.order.message).to.equal('Order does not exist');
          done();
        });
    });

    it('should check if meal exists in the days menu', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': customerToken,
        })
        .send({
          mealId: 3,
        })
        .end((err, resp) => {
          expect(resp.body.errors.meal.statusCode).to.equal(400);
          expect(resp.body.errors.meal.message).to.equal('Meal does not exist in menu');
          done();
        });
    });

    it('should require a status', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': customerToken,
        })
        .send({
          mealId: 1,
        })
        .end((err, resp) => {
          expect(resp.body.errors.status.statusCode).to.equal(400);
          expect(resp.body.errors.status.message).to.equal('Status is required');
          done();
        });
    });

    it('should require a valid status', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': customerToken,
        })
        .send({
          ...validOrder1,
          status: 'abc',
        })
        .end((err, resp) => {
          expect(resp.body.errors.status.statusCode).to.equal(400);
          expect(resp.body.errors.status.message).to.equal('Status is invalid');
          done();
        });
    });

    it('should not update if order status is not pending', async () => {
      await Orders.update({ id: 1, status: 'complete' });
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          ...validOrder1,
          status: 'canceled',
        })
        .end((err, resp) => {
          expect(resp.body.errors.status.statusCode).to.equal(403);
          expect(resp.body.errors.status.message).to.equal('Cannot change status');
        });
    });

    it('should not allow customer update status to complete', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': customerToken,
        })
        .send({
          ...validOrder1,
          status: 'complete',
        })
        .end((err, resp) => {
          expect(resp.body.errors.status.statusCode).to.equal(403);
          expect(resp.body.errors.status.message).to.equal('Can only update status with canceled or pending');
          done();
        });
    });

    it('should not allow customer change another users order', (done) => {
      request(app)
        .put('/api/v1/orders/2')
        .set({
          'x-access-token': customerToken,
        })
        .send({
          ...validOrder1,
          status: 'canceled',
        })
        .end((err, resp) => {
          expect(resp.body.errors.access.statusCode).to.equal(403);
          expect(resp.body.errors.access.message).to.equal('Unauthorized access');
          done();
        });
    });

    it('should allow caterer change another users order if the status is complete', (done) => {
      request(app)
        .put('/api/v1/orders/2')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          status: 'complete',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.order.status).to.equal('complete');
          done();
        });
    });

    it('should allow customer update status to canceled', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': customerToken,
        })
        .send({
          status: 'canceled',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.order.status).to.equal('canceled');
          done();
        });
    });

    it('should allow caterer who created the meal in the order update status to canceled', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          status: 'canceled',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.order.status).to.equal('canceled');
          done();
        });
    });

    it('should not allow caterer who did not created the meal in the order update status to canceled', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': catererToken2,
        })
        .send({
          status: 'canceled',
        })
        .end((err, resp) => {
          expect(resp.body.errors.access.statusCode).to.equal(403);
          expect(resp.body.errors.access.message).to.equal('Unauthorized access');
          done();
        });
    });

    it('should allow admin update status to canceled', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': adminToken,
        })
        .send({
          status: 'canceled',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.order.status).to.equal('canceled');
          done();
        });
    });

    it('should allow caterer who created the meal in the order update status to complete', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          status: 'complete',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.order.status).to.equal('complete');
          done();
        });
    });

    it('should not allow caterer who did not created the meal in the order update status to complete', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': catererToken2,
        })
        .send({
          ...validOrder1,
          status: 'complete',
        })
        .end((err, resp) => {
          expect(resp.body.errors.access.statusCode).to.equal(403);
          expect(resp.body.errors.access.message).to.equal('Unauthorized access');
          done();
        });
    });

    it('should allow admin update status to complete', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': adminToken,
        })
        .send({
          status: 'complete',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.order.status).to.equal('complete');
          done();
        });
    });

    it('should allow customer update meal id and quantity', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': customerToken,
        })
        .send({
          mealId: 1,
          quantity: 5,
          status: 'canceled',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.order.mealId).to.equal(1);
          expect(resp.body.order.quantity).to.equal(5);
          expect(resp.body.order.status).to.equal('canceled');
          done();
        });
    });

    it('should not update meal id and quantity for caterer', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          mealId: 1,
          quantity: 5,
          status: 'pending',
        })
        .end((err, resp) => {
          expect(resp.body.errors.meal.statusCode).to.equal(403);
          expect(resp.body.errors.meal.message).to.equal('Only customers are allowed to change meal option');
          expect(resp.body.errors.quantity.statusCode).to.equal(403);
          expect(resp.body.errors.quantity.message).to.equal('Only customers are allowed to change quantity');
          done();
        });
    });

    it('should not update meal id and quantity for admin', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': adminToken,
        })
        .send({
          mealId: 1,
          quantity: 5,
          status: 'pending',
        })
        .end((err, resp) => {
          expect(resp.body.errors.meal.statusCode).to.equal(403);
          expect(resp.body.errors.meal.message).to.equal('Only customers are allowed to change meal option');
          expect(resp.body.errors.quantity.statusCode).to.equal(403);
          expect(resp.body.errors.quantity.message).to.equal('Only customers are allowed to change quantity');
          done();
        });
    });

    it('should require a valid meal id if provided', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          mealId: 'abc',
          quantity: 5,
        })
        .end((err, resp) => {
          expect(resp.body.errors.meal.statusCode).to.equal(400);
          expect(resp.body.errors.meal.message).to.equal('Meal id is invalid');
          done();
        });
    });

    it('should require an existing meal id if provided', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          mealId: 99,
          quantity: 5,
        })
        .end((err, resp) => {
          expect(resp.body.errors.meal.statusCode).to.equal(400);
          expect(resp.body.errors.meal.message).to.equal('Meal does not exist');
          done();
        });
    });

    it('should require a valid quantity if provided', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          mealId: 1,
          quantity: 'abc',
        })
        .end((err, resp) => {
          expect(resp.body.errors.quantity.statusCode).to.equal(400);
          expect(resp.body.errors.quantity.message).to.equal('Quantity is invalid');
          done();
        });
    });

    it('should require a quantity above zero if provided', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          mealId: 1,
          quantity: -3,
          status: 'pending',
        })
        .end((err, resp) => {
          expect(resp.body.errors.quantity.statusCode).to.equal(400);
          expect(resp.body.errors.quantity.message).to.equal('Quantity should be greater than zero');
          done();
        });
    });
  });

  describe('GET: Get Orders - /api/orders', () => {
    // before each hook to clean and insert data to the db
    beforeEach(async () => {
      await clearMeals();
      await clearOrders();
      await insertSeedMeal(existingMeal);
      await insertSeedOrder(existingOrder);
      await insertSeedOrder({ ...existingOrder, userId: 2 });
      await insertSeedOrder({ ...validOrder2, userId: 2 });
      await insertSeedOrder({ ...validOrder1, userId: 3 });
    });

    it('should require an authentication token', (done) => {
      request(app)
        .get('/api/v1/orders')
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body.message).to.equal('Authentication failed. No token provided');
          done();
        });
    });

    it('should require a valid authentication token', (done) => {
      request(app)
        .get('/api/v1/orders')
        .set({
          'x-access-token': 'rkrri444443223sdkd.rererer.weewewe3434',
        })
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body.message).to.equal('Token is invalid or has expired');
          done();
        });
    });

    it('should only return an array of orders created by the customer', (done) => {
      request(app)
        .get('/api/v1/orders')
        .set({
          'x-access-token': customerToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.orders).to.be.an('array');
          expect(resp.body.orders.length).to.equal(2);
          expect(resp.body.orders[0].id).to.equal(2);
          expect(resp.body.orders[0].mealId).to.equal(1);
          expect(resp.body.orders[0].meal.name).to.equal('Curry Rice');
          expect(resp.body.orders[0].status).to.equal('pending');
          expect(resp.body.orders[0].image).to.not.equal(null);
          done();
        });
    });

    it('should return an array of all orders to the admin', (done) => {
      request(app)
        .get('/api/v1/orders')
        .set({
          'x-access-token': adminToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.orders).to.be.an('array');
          expect(resp.body.orders.length).to.equal(4);
          expect(resp.body.orders[3].id).to.equal(4);
          expect(resp.body.orders[3].mealId).to.equal(1);
          expect(resp.body.orders[3].meal.name).to.equal('Curry Rice');
          expect(resp.body.orders[3].status).to.equal('pending');
          expect(resp.body.orders[3].image).to.not.equal(null);
          expect(resp.body.orders[3].cost).to.equal(4500);
          done();
        });
    });

    it('should return an array of all orders with meals created by the caterer', (done) => {
      request(app)
        .get('/api/v1/orders')
        .set({
          'x-access-token': catererToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.orders).to.be.an('array');
          expect(resp.body.orders.length).to.equal(4);
          expect(resp.body.orders[3].id).to.equal(4);
          expect(resp.body.orders[3].mealId).to.equal(1);
          expect(resp.body.orders[3].meal.name).to.equal('Curry Rice');
          expect(resp.body.orders[3].status).to.equal('pending');
          expect(resp.body.orders[3].image).to.not.equal(null);
          expect(resp.body.orders[3].cost).to.equal(4500);
          done();
        });
    });

    it('should not return any record if meal in orders was not created by caterer', (done) => {
      request(app)
        .get('/api/v1/orders')
        .set({
          'x-access-token': catererToken2,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.orders).to.be.an('array');
          expect(resp.body.orders.length).to.equal(0);
          done();
        });
    });
  });
});
