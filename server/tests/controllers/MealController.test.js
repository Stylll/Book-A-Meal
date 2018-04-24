import { expect } from 'chai';
import request from 'supertest';
import app from '../../server';
import Authenticate from '../../utils/authentication/authenticate';
import {
  defaultImage,
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
  validUser1,
} from '../../utils/seeders/userSeeder';


/* eslint-disable no-undef */
describe('Test Suite for Meal Controller', () => {
  // create existing users
  insertSeedUsers(existingUser);
  insertSeedUsers(validUser1);

  // generate access token for users
  const catererToken = Authenticate.authenticateUser(existingUser);
  const customerToken = Authenticate.authenticateUser(validUser1);

  describe('POST: Create Meal - /api/v1/meals', () => {

    beforeEach(() => {
      clearMeals();
      insertSeedMeal(validMeal1);
    });

    it('should require an authentication token', (done) => {
      request(app)
        .post('/api/v1/meals')
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body.message).to.equal('Authentication failed. No token provided');
          done();
        });
    });

    it('should require a valid authentication token', (done) => {
      request(app)
        .post('/api/v1/meals')
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

    it('should require a caterer user account', (done) => {
      request(app)
        .post('/api/v1/meals')
        .set({
          'x-access-token': customerToken,
        })
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body.message).to.equal('Unauthorized Access');
          done();
        });
    });

    it('should require meal name', (done) => {
      request(app)
        .post('/api/v1/meals')
        .set({
          'x-access-token': catererToken,
        })
        .send({

        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Meal name is required');
          done();
        });
    });

    it('should require a unique meal name', (done) => {
      request(app)
        .post('/api/v1/meals')
        .set({
          'x-access-token': catererToken,
        })
        .send(validMeal1)
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Meal name already exists');
          done();
        });
    });

    it('should require meal price', (done) => {
      request(app)
        .post('/api/v1/meals')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          name: validMeal1.name,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Price is required');
          done();
        });
    });

    it('should set default image if image is not provided', () => {
      request(app)
        .post('/api/v1/meals')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          name: validMeal2.name,
          price: validMeal2.price,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          expect(resp.body).to.haveOwnProperty('meal');
          expect(resp.body.meal.image).to.equal(defaultImage);
          done();
        });
    });

    it('should return meal with proper objects and proper status code', () => {
      request(app)
        .post('/api/v1/meals')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          name: validMeal2.name,
          price: validMeal2.price,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          expect(resp.body).to.haveOwnProperty('meal');
          expect(resp.body.meal.name).to.equal(validMeal2.name);
          expect(resp.body.meal.price).to.equal(validMeal2.price);
          expect(resp.body.meal.image).to.equal(defaultImage);
          expect(resp.body.meal).to.haveOwnProperty('userId');
          done();
        });
    });
  });
});
