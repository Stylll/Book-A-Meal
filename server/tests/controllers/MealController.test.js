import { expect } from 'chai';
import request from 'supertest';
import app from '../../server';
import meals from '../../db/meals';
import Authenticate from '../../utils/authentication/authenticate';
import {
  defaultImage,
  validMeal1,
  validMeal2,
  existingMeal,
  insertSeedMeal,
  clearMeals,
} from '../../utils/seeders/mealSeeder';
import {
  existingUser,
  insertSeedUsers,
  validUser1,
  validUser2,
  adminUser,
  clearUsers,
} from '../../utils/seeders/userSeeder';


/* eslint-disable no-undef */
describe('Test Suite for Meal Controller', () => {
  // create existing users
  before(async () => {
    await clearUsers();
    await insertSeedUsers(existingUser);
    await insertSeedUsers(validUser1);
    await insertSeedUsers(validUser2);
    await insertSeedUsers(adminUser);
  });

  // generate access token for users
  const catererToken = Authenticate.authenticateUser({ id: 1, ...existingUser });
  const catererToken2 = Authenticate.authenticateUser({ id: 5, ...existingUser });
  const customerToken = Authenticate.authenticateUser({ id: 2, ...validUser1 });
  const adminToken = Authenticate.authenticateUser({ id: 4, ...adminUser });

  describe('POST: Create Meal - /api/v1/meals', () => {
    // before each hook to clean and insert data to the db
    beforeEach(async () => {
      await clearMeals();
      await insertSeedMeal(existingMeal);
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
          expect(resp.status).to.equal(403);
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
          expect(resp.body.errors.name.statusCode).to.equal(400);
          expect(resp.body.errors.name.message).to.equal('Meal name is required');
          done();
        });
    });

    it('should require a unique meal name', (done) => {
      request(app)
        .post('/api/v1/meals')
        .set({
          'x-access-token': catererToken,
        })
        .send(existingMeal)
        .end((err, resp) => {
          expect(resp.body.errors.name.statusCode).to.equal(409);
          expect(resp.body.errors.name.message).to.equal('Meal name already exists');
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
          expect(resp.body.errors.price.statusCode).to.equal(400);
          expect(resp.body.errors.price.message).to.equal('Price is required');
          done();
        });
    });

    it('should require a valid price', (done) => {
      request(app)
        .post('/api/v1/meals')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          name: validMeal1.name,
          price: 'Three zero',
        })
        .end((err, resp) => {
          expect(resp.body.errors.price.statusCode).to.equal(400);
          expect(resp.body.errors.price.message).to.equal('Price is invalid');
          done();
        });
    });

    it('should require meal price above 1', (done) => {
      request(app)
        .post('/api/v1/meals')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          name: validMeal1.name,
          price: 1,
        })
        .end((err, resp) => {
          expect(resp.body.errors.price.statusCode).to.equal(400);
          expect(resp.body.errors.price.message).to.equal('Price must be greater than one');
          done();
        });
    });

    it('should set default image if image is not provided', (done) => {
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

    it('should return meal with proper objects and proper status code', (done) => {
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
          expect(resp.body.meal.userId).to.not.equal(null);
          expect(resp.body.meal.userId).to.equal(1);
          done();
        });
    });
  });

  describe('PUT: Update Meal - /api/v1/meals/:id', () => {
    // before each hook to clean and insert data to the db
    beforeEach(async () => {
      await clearMeals();
      await insertSeedMeal(existingMeal);
      await insertSeedMeal(validMeal2);
      await insertSeedMeal({ ...validMeal2, name: 'Burger and fries', userId: 3 });
    });

    it('should require an authentication token', (done) => {
      request(app)
        .put('/api/v1/meals/1')
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body.message).to.equal('Authentication failed. No token provided');
          done();
        });
    });

    it('should require a valid authentication token', (done) => {
      request(app)
        .put('/api/v1/meals/1')
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
        .put('/api/v1/meals/1')
        .set({
          'x-access-token': customerToken,
        })
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(403);
          expect(resp.body.message).to.equal('Unauthorized Access');
          done();
        });
    });

    it('should require existing meal using meal id', (done) => {
      request(app)
        .put('/api/v1/meals/30')
        .set({
          'x-access-token': catererToken,
        })
        .send(validMeal1)
        .end((err, resp) => {
          expect(resp.body.errors.id.statusCode).to.equal(400);
          expect(resp.body.errors.id.message).to.equal('Meal does not exist');
          done();
        });
    });

    it('should require a unique meal name', (done) => {
      request(app)
        .put('/api/v1/meals/1')
        .set({
          'x-access-token': catererToken,
        })
        .send(validMeal2)
        .end((err, resp) => {
          expect(resp.body.errors.name.statusCode).to.equal(409);
          expect(resp.body.errors.name.message).to.equal('Meal name already exists');
          done();
        });
    });

    it('should require a valid price', (done) => {
      request(app)
        .put('/api/v1/meals/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          ...validMeal1,
          price: 'Three zero',
        })
        .end((err, resp) => {
          expect(resp.body.errors.price.statusCode).to.equal(400);
          expect(resp.body.errors.price.message).to.equal('Price is invalid');
          done();
        });
    });

    it('should require meal price above 1', (done) => {
      request(app)
        .put('/api/v1/meals/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          name: validMeal1.name,
          price: 1,
        })
        .end((err, resp) => {
          expect(resp.body.errors.price.statusCode).to.equal(400);
          expect(resp.body.errors.price.message).to.equal('Price must be greater than one');
          done();
        });
    });

    it('should use previous image if image is not provided', (done) => {
      request(app)
        .put('/api/v1/meals/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          name: validMeal1.name,
          price: validMeal2.price,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body).to.haveOwnProperty('meal');
          expect(resp.body.meal.image).to.equal(defaultImage);
          done();
        });
    });

    it('should return updated meal with proper objects and proper status code', (done) => {
      validMeal2.name = 'Jollof rice';
      validMeal2.price = 4030;
      request(app)
        .put('/api/v1/meals/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          name: validMeal2.name,
          price: validMeal2.price,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body).to.haveOwnProperty('meal');
          expect(resp.body.meal.name).to.equal(validMeal2.name);
          expect(resp.body.meal.price).to.equal(validMeal2.price);
          expect(resp.body.meal.image).to.equal(defaultImage);
          expect(resp.body.meal).to.haveOwnProperty('userId');
          expect(resp.body.meal.userId).to.not.equal(null);
          expect(resp.body.meal.userId).to.equal(1);
          done();
        });
    });

    it('should not update if caterer is not the creator of the meal', (done) => {
      request(app)
        .put('/api/v1/meals/2')
        .set({
          'x-access-token': catererToken2,
        })
        .send({
          name: 'Jollof rice',
          price: 4030,
        })
        .end((err, resp) => {
          expect(resp.body.errors.access.statusCode).to.equal(403);
          expect(resp.body.errors.access.message).to.equal('Unauthorized access');
          done();
        });
    });
  });

  describe('GET: Get Meals - /api/v1/meals', () => {
    // before each hook to clean and insert data to the db
    beforeEach(async () => {
      await clearMeals();
      await insertSeedMeal(existingMeal);
      await insertSeedMeal(validMeal1);
      await insertSeedMeal({ ...validMeal2, userId: 3 });
    });

    it('should require an authentication token', (done) => {
      request(app)
        .get('/api/v1/meals')
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body.message).to.equal('Authentication failed. No token provided');
          done();
        });
    });

    it('should require a valid authentication token', (done) => {
      request(app)
        .get('/api/v1/meals')
        .set({
          'x-access-token': 'rkrri444443223sdkd.rererer.weewewe3434',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body.message).to.equal('Token is invalid or has expired');
          done();
        });
    });

    it('should require a caterer user account', (done) => {
      request(app)
        .get('/api/v1/meals')
        .set({
          'x-access-token': customerToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(403);
          expect(resp.body.message).to.equal('Unauthorized Access');
          done();
        });
    });

    it('should return an array of meals created by the logged in user', (done) => {
      request(app)
        .get('/api/v1/meals')
        .set({
          'x-access-token': catererToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.meals).to.be.an('array');
          expect(resp.body.meals[0])
            .to.have.all.deep.keys('id', 'name', 'price', 'image', 'userId');
          expect(resp.body.meals.length).to.equal(2);
          expect(resp.body.meals[0].name).to.equal(validMeal1.name);
          expect(resp.body.meals[1].name).to.equal(existingMeal.name);
          expect(resp.body.meals[1].userId).to.equal(1);
          expect(resp.body.meals[1].price).to.equal(existingMeal.price);
          done();
        });
    });

    it('should return all meals for an admin user', (done) => {
      request(app)
        .get('/api/v1/meals')
        .set({
          'x-access-token': adminToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.meals).to.be.an('array');
          expect(resp.body.meals[0])
            .to.have.all.deep.keys('id', 'name', 'price', 'image', 'userId');
          expect(resp.body.meals.length).to.equal(3);
          expect(resp.body.meals[0].name).to.equal(validMeal2.name);
          expect(resp.body.meals[1].name).to.equal(validMeal1.name);
          expect(resp.body.meals[2].name).to.equal(existingMeal.name);
          expect(resp.body.meals[0].price).to.equal(validMeal2.price);
          expect(resp.body.meals[1].price).to.equal(validMeal1.price);
          expect(resp.body.meals[2].price).to.equal(existingMeal.price);
          done();
        });
    });

    it('should not return null objects', async () => {
      await meals.delete(1);
      request(app)
        .get('/api/v1/meals')
        .set({
          'x-access-token': catererToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.meals).to.be.an('array');
          expect(resp.body.meals[0]).to.not.equal(null);
          expect(resp.body.meals.length).to.equal(1);
          expect(resp.body.meals[0].id).to.equal(2);
        });
    });
  });

  describe('DELETE: Delete Meal - /api/v1/meals', () => {
    // before each hook to clean and insert data to the db
    beforeEach(async () => {
      await clearMeals();
      await insertSeedMeal(existingMeal);
      await insertSeedMeal(validMeal1);
      await insertSeedMeal({ ...validMeal2, userId: 3 });
    });

    it('should require an authentication token', (done) => {
      request(app)
        .delete('/api/v1/meals/1')
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body.message).to.equal('Authentication failed. No token provided');
          done();
        });
    });

    it('should require a valid authentication token', (done) => {
      request(app)
        .delete('/api/v1/meals/1')
        .set({
          'x-access-token': 'rkrri444443223sdkd.rererer.weewewe3434',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body.message).to.equal('Token is invalid or has expired');
          done();
        });
    });

    it('should require a caterer user account', (done) => {
      request(app)
        .delete('/api/v1/meals/1')
        .set({
          'x-access-token': customerToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(403);
          expect(resp.body.message).to.equal('Unauthorized Access');
          done();
        });
    });

    it('should require an existing meal', (done) => {
      request(app)
        .delete('/api/v1/meals/99')
        .set({
          'x-access-token': catererToken,
        })
        .end((err, resp) => {
          expect(resp.body.errors.id.statusCode).to.equal(400);
          expect(resp.body.errors.id.message).to.equal('Meal does not exist');
          done();
        });
    });

    it('should delete meal with valid meal id', (done) => {
      request(app)
        .delete('/api/v1/meals/1')
        .set({
          'x-access-token': catererToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.message).to.equal('Meal deleted successfully');
          done();
        });
    });

    it('should not delete meal if the caterer is not the creator of the meal', (done) => {
      request(app)
        .delete('/api/v1/meals/3')
        .set({
          'x-access-token': catererToken,
        })
        .end((err, resp) => {
          expect(resp.body.errors.access.statusCode).to.equal(403);
          expect(resp.body.errors.access.message).to.equal('Unauthorized access');
          done();
        });
    });
  });
});
