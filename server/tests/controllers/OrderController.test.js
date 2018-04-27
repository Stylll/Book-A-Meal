import { expect } from 'chai';
import request from 'supertest';
import app from '../../server';
import Authenticate from '../../utils/authentication/authenticate';
import {
  existingUser,
  insertSeedUsers,
  validUser1,
  validUser2,
} from '../../utils/seeders/userSeeder';
import {
  existingMeal,
  clearMeals,
  insertSeedMeal,
} from '../../utils/seeders/mealSeeder';
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
  // create existing users
  insertSeedUsers(existingUser);
  insertSeedUsers(validUser1);
  insertSeedUsers(validUser2);

  // generate access token for users
  const catererToken = Authenticate.authenticateUser({ id: 1, ...existingUser });
  const customerToken = Authenticate.authenticateUser({ id: 2, ...validUser1 });

  describe('POST: Create Order - /api/orders', () => {
    // before each hook to clean and insert data to the db
    beforeEach(() => {
      clearMeals();
      clearOrders();
      insertSeedMeal(existingMeal);
      insertSeedOrder(existingOrder);
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
          expect(resp.status).to.equal(401);
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
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Meal id is required');
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
          expect(resp.status).to.equal(404);
          expect(resp.body.message).to.equal('Meal does not exist');
          done();
        });
    });

    it('should require price', (done) => {
      request(app)
        .post('/api/v1/orders')
        .set({
          'x-access-token': customerToken,
        })
        .send({
          mealId: 1,
          price: 0,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Price is required');
          done();
        });
    });

    it('should require a valid price', (done) => {
      request(app)
        .post('/api/v1/orders')
        .set({
          'x-access-token': customerToken,
        })
        .send({
          mealId: validOrder1.mealId,
          price: 'abc',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Price is invalid');
          done();
        });
    });

    it('should require a price above one', (done) => {
      request(app)
        .post('/api/v1/orders')
        .set({
          'x-access-token': customerToken,
        })
        .send({
          mealId: validOrder1.mealId,
          price: 1,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Price must be greater than one');
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
          price: validOrder1.price,
          quantity: 0,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Quantity is required');
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
          price: validOrder1.price,
          quantity: 'abc',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Quantity is invalid');
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
          expect(resp.body.order.price).to.equal(validOrder1.price);
          expect(resp.body.order.quantity).to.equal(validOrder1.quantity);
          expect(resp.body.order.status).to.equal('pending');
          expect(resp.body.order.userId).to.equal(2);
          expect(resp.body.order.cost).to.equal(validOrder1.price * validOrder1.quantity);
          expect(resp.body.order).to.haveOwnProperty('createdAt');
          expect(resp.body.order).to.haveOwnProperty('updatedAt');
          done();
        });
    });
  });

  describe('PUT: Update Order - /api/orders/:id', () => {
    // before each hook to clean and insert data to the db
    beforeEach(() => {
      clearMeals();
      clearOrders();
      insertSeedMeal(existingMeal);
      insertSeedOrder({ ...existingOrder, userId: 2 });
      insertSeedOrder({ ...validOrder1, userId: 3 });
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
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Order id is invalid');
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
          expect(resp.status).to.equal(404);
          expect(resp.body.message).to.equal('Order does not exist');
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
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Status is required');
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
          status: 'abc',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Status is invalid');
          done();
        });
    });

    it('should not update if order status is not pending', (done) => {
      Orders.update({ id: 1, status: 'complete' });
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          status: 'canceled',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(403);
          expect(resp.body.message).to.equal('Cannot change status');
          done();
        });
    });

    it('should not allow customer update status to complete', (done) => {
      request(app)
        .put('/api/v1/orders/1')
        .set({
          'x-access-token': customerToken,
        })
        .send({
          status: 'complete',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(403);
          expect(resp.body.message).to.equal('Can only change status to canceled');
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
          status: 'canceled',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(403);
          expect(resp.body.message).to.equal('Unauthorized Access');
          done();
        });
    });

    it('should allow caterer change another users order', (done) => {
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

    it('should allow caterer updated status to canceled', (done) => {
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

    it('should allow caterer update status to complete', (done) => {
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
  });

  describe('GET: Get Orders - /api/orders', () => {
    // before each hook to clean and insert data to the db
    beforeEach(() => {
      clearMeals();
      clearOrders();
      insertSeedMeal(existingMeal);
      insertSeedOrder(existingOrder);
      insertSeedOrder({ ...existingOrder, userId: 2 });
      insertSeedOrder({ ...validOrder2, userId: 2 });
      insertSeedOrder({ ...validOrder1, userId: 3 });
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
          expect(resp.body.orders[0].mealName).to.equal('Rice and Stew');
          expect(resp.body.orders[0].status).to.equal('pending');
          expect(resp.body.orders[3].image).to.not.equal(null);
          done();
        });
    });

    it('should return an array of all orders to the caterer', (done) => {
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
          expect(resp.body.orders[3].mealName).to.equal('Rice and Stew');
          expect(resp.body.orders[3].status).to.equal('pending');
          expect(resp.body.orders[3].image).to.not.equal(null);
          expect(resp.body.orders[3].cost).to.equal(4500);
          done();
        });
    });
  });
});
