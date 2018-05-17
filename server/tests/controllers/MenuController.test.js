import { expect } from 'chai';
import request from 'supertest';
import app from '../../server';
import Authenticate from '../../utils/authentication/authenticate';
import { getNormalDate, beautifyDate } from '../../utils/dateBeautifier';
import { transporter } from '../../utils/mailer/NodeMailer';

import {
  existingMenu,
  currentMenu,
  insertSeedMenu,
  clearMenus,
} from '../../utils/seeders/menuSeeder';

import {
  validMeal1,
  validMeal2,
  existingMeal,
  insertSeedMeal,
  clearMeals,
} from '../../utils/seeders/mealSeeder';

import {
  validUser1,
  existingUser,
  insertSeedUsers,
  validUser2,
  adminUser,
  clearUsers,
} from '../../utils/seeders/userSeeder';

transporter.sendMail = () => Promise.resolve(1);

/* eslint-disable no-undef */
describe('Test Suite for Menu Controller', () => {
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
  const caterer2Token = Authenticate.authenticateUser({ id: 3, ...validUser2 });
  const adminToken = Authenticate.authenticateUser({ id: 4, ...adminUser });

  describe('POST: Create Menu - /api/v1/menu', () => {
    // before each hook to clean and insert data to the db
    beforeEach(async () => {
      await clearMeals();
      await clearMenus();
      await insertSeedMeal(existingMeal);
      await insertSeedMeal(validMeal1);
      await insertSeedMeal(validMeal2);
      await insertSeedMenu(existingMenu);
    });

    it('should require an authentication token', (done) => {
      request(app)
        .post('/api/v1/menu')
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body.message).to.equal('Authentication failed. No token provided');
          done();
        });
    });

    it('should require a valid authentication token', (done) => {
      request(app)
        .post('/api/v1/menu')
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

    it('should require a caterer / admin user account', (done) => {
      request(app)
        .post('/api/v1/menu')
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

    it('should create menu with current date by default', (done) => {
      request(app)
        .post('/api/v1/menu')
        .set({
          'x-access-token': catererToken,
        })
        .send({ mealIds: [1, 2] })
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          expect(resp.body).to.haveOwnProperty('menu');
          expect(resp.body.menu.date).to.equal(getNormalDate(new Date()));
          expect(resp.body.menu.name).to.equal(`Menu For ${beautifyDate(new Date())}`);
          expect(resp.body.menu).to.haveOwnProperty('mealIds');
          expect(resp.body.menu.mealIds).to.eql([1, 2]);
          expect(resp.body.menu.userId).to.equal(1);
          done();
        });
    });

    it('should not create multiple menus for the same day', async () => {
      await insertSeedMenu(currentMenu);
      request(app)
        .post('/api/v1/menu')
        .set({
          'x-access-token': catererToken,
        })
        .send({ mealIds: [1, 2] })
        .end((err, resp) => {
          expect(resp.body.errors.menu.statusCode).to.equal(409);
          expect(resp.body.errors.menu.message).to.equal('Menu for the day already exists');
        });
    });

    it('should require meal ids', (done) => {
      request(app)
        .post('/api/v1/menu')
        .set({
          'x-access-token': catererToken,
        })
        .send({
        })
        .end((err, resp) => {
          expect(resp.body.errors.meals.statusCode).to.equal(400);
          expect(resp.body.errors.meals.message).to.equal('Array of meal ids is required');
          done();
        });
    });

    it('should require meal ids is an array', (done) => {
      request(app)
        .post('/api/v1/menu')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          mealIds: { 1: 'a', 2: 'b', 3: 'c' },
        })
        .end((err, resp) => {
          expect(resp.body.errors.meals.statusCode).to.equal(400);
          expect(resp.body.errors.meals.message).to.equal('Meal ids must be in an array');
          done();
        });
    });

    it('should save unique meal ids', (done) => {
      request(app)
        .post('/api/v1/menu')
        .set({
          'x-access-token': catererToken,
        })
        .send({ mealIds: [1, 1, 2, 2] })
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          expect(resp.body.menu.mealIds[0]).to.equal(1);
          expect(resp.body.menu.mealIds[1]).to.equal(2);
          expect(resp.body.menu.mealIds).to.eql([1, 2]);
          done();
        });
    });

    it('should not add if array contains non existing meals', (done) => {
      request(app)
        .post('/api/v1/menu')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          mealIds: [1, 2, 5, 7, 8],
        })
        .end((err, resp) => {
          expect(resp.body.errors.meals.statusCode).to.equal(400);
          expect(resp.body.errors.meals.message).to.equal('One or more meals don\'t exist in the database');
          done();
        });
    });

    it('should not allow caterer add another caterers meal', (done) => {
      request(app)
        .post('/api/v1/menu')
        .set({
          'x-access-token': caterer2Token,
        })
        .send({
          mealIds: [1, 2],
        })
        .end((err, resp) => {
          expect(resp.body.errors.access.statusCode).to.equal(403);
          expect(resp.body.errors.access.message).to.equal('Cannot add another caterers meal');
          done();
        });
    });

    it('should allow admin add any caterers meal', (done) => {
      request(app)
        .post('/api/v1/menu')
        .set({
          'x-access-token': adminToken,
        })
        .send({
          mealIds: [1, 2],
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          expect(resp.body.menu.mealIds[0]).to.equal(1);
          expect(resp.body.menu.mealIds[1]).to.equal(2);
          expect(resp.body.menu).to.haveOwnProperty('id');
          expect(resp.body.menu).to.haveOwnProperty('name');
          expect(resp.body.menu).to.haveOwnProperty('date');
          expect(resp.body.menu).to.haveOwnProperty('mealIds');
          expect(resp.body.menu).to.haveOwnProperty('userId');
          expect(resp.body.menu.mealIds).to.be.an('array');
          done();
        });
    });
  });

  describe('PUT: Update Menu - /api/v1/menu/:id', () => {
    // before each hook to clean and insert data to the db
    beforeEach(async () => {
      await clearMeals();
      await clearMenus();
      await insertSeedMeal(existingMeal);
      await insertSeedMeal(validMeal1);
      await insertSeedMeal(validMeal2);
      await insertSeedMenu(existingMenu);
    });

    it('should require an authentication token', (done) => {
      request(app)
        .post('/api/v1/menu')
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body.message).to.equal('Authentication failed. No token provided');
          done();
        });
    });

    it('should require a valid authentication token', (done) => {
      request(app)
        .post('/api/v1/menu')
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

    it('should require a caterer / admin user account', (done) => {
      request(app)
        .post('/api/v1/menu')
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

    it('should require a valid menu id', (done) => {
      request(app)
        .put('/api/v1/menu/ab')
        .set({
          'x-access-token': catererToken,
        })
        .send({
        })
        .end((err, resp) => {
          expect(resp.body.errors.id.statusCode).to.equal(400);
          expect(resp.body.errors.id.message).to.equal('Menu id is invalid');
          done();
        });
    });

    it('should require an existing menu id', (done) => {
      request(app)
        .put('/api/v1/menu/99')
        .set({
          'x-access-token': catererToken,
        })
        .send({
        })
        .end((err, resp) => {
          expect(resp.body.errors.id.statusCode).to.equal(400);
          expect(resp.body.errors.id.message).to.equal('Menu does not exist');
          done();
        });
    });

    it('should require meal ids', (done) => {
      request(app)
        .put('/api/v1/menu/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({
        })
        .end((err, resp) => {
          expect(resp.body.errors.meals.statusCode).to.equal(400);
          expect(resp.body.errors.meals.message).to.equal('Array of meal ids is required');
          done();
        });
    });

    it('should require meal ids is an array', (done) => {
      request(app)
        .put('/api/v1/menu/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          mealIds: { 1: 'a', 2: 'b', 3: 'c' },
        })
        .end((err, resp) => {
          expect(resp.body.errors.meals.statusCode).to.equal(400);
          expect(resp.body.errors.meals.message).to.equal('Meal ids must be in an array');
          done();
        });
    });

    it('should save unique meal ids', (done) => {
      request(app)
        .put('/api/v1/menu/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({ mealIds: [1, 1, 2, 2] })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.menu.mealIds[0]).to.equal(1);
          expect(resp.body.menu.mealIds[1]).to.equal(2);
          expect(resp.body.menu.mealIds).to.eql([1, 2]);
          done();
        });
    });

    it('should not save if non integer values are in the array', () => {
      request(app)
        .put('/api/v1/menu/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({ mealIds: [1, 1, 2, 2, 'a'] })
        .end((err, resp) => {
          expect(resp.body.errors.meals.statusCode).to.equal(400);
          expect(resp.body.errors.meals.message).to.equal('One or more meal ids are invalid');
        });
    });

    it('should add only existing meals to menu', (done) => {
      request(app)
        .put('/api/v1/menu/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          mealIds: [1, 2, 5, 7, 8],
        })
        .end((err, resp) => {
          expect(resp.body.errors.meals.statusCode).to.equal(400);
          expect(resp.body.errors.meals.message).to.equal('One or more meals don\'t exist in the database');
          done();
        });
    });
  });

  describe('GET: Get Menu - /api/v1/menu', () => {
    // before each hook to clean and insert data to the db
    beforeEach(async () => {
      await clearMenus();
      await clearMeals();
      await insertSeedMeal(existingMeal);
      await insertSeedMeal(validMeal1);
      await insertSeedMeal(validMeal2);
      await insertSeedMenu({ ...currentMenu, mealIds: [1, 2] });
      await insertSeedMenu(existingMenu);
    });

    it('should require an authentication token', (done) => {
      request(app)
        .get('/api/v1/menu')
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body.message).to.equal('Authentication failed. No token provided');
          done();
        });
    });

    it('should require a valid authentication token', (done) => {
      request(app)
        .get('/api/v1/menu')
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

    it('should return an array of menus for caterer', (done) => {
      request(app)
        .get('/api/v1/menu')
        .set({
          'x-access-token': catererToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.menus).to.be.an('array');
          expect(resp.body.menus[0].id).to.equal(2);
          expect(resp.body.menus[0].name).to.equal(existingMenu.name);
          expect(resp.body.menus[0].date).to.equal(existingMenu.date);
          expect(resp.body.menus.length).to.be.greaterThan(1);
          done();
        });
    });

    it('should return current day menu object for customer', (done) => {
      request(app)
        .get('/api/v1/menu')
        .set({
          'x-access-token': customerToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.menu).to.be.an('object');
          expect(resp.body.menu.id).to.equal(1);
          expect(resp.body.menu.name).to.equal(currentMenu.name);
          expect(resp.body.menu.date).to.equal(currentMenu.date);
          done();
        });
    });

    it('should return empty array if no menu exists when caterer requests', async () => {
      await clearMenus();
      request(app)
        .get('/api/v1/menu')
        .set({
          'x-access-token': catererToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.menus).to.be.an('array');
          expect(resp.body.menus.length).to.equal(0);
        });
    });

    it('should show error message if no menu exists when customer requests', async () => {
      await clearMenus();
      request(app)
        .get('/api/v1/menu')
        .set({
          'x-access-token': customerToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(404);
          expect(resp.body.message).to.equal('Menu for the day not set');
        });
    });

    it('should contain meal objects for caterer', (done) => {
      request(app)
        .get('/api/v1/menu')
        .set({
          'x-access-token': catererToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.menus).to.be.an('array');
          expect(resp.body.menus[0].meals).to.be.an('array');
          expect(resp.body.menus[0].meals[0].id).to.equal(1);
          expect(resp.body.menus[0].meals[0].name).to.equal(existingMeal.name);
          expect(resp.body.menus[0].meals[0].price).to.equal(existingMeal.price);
          expect(resp.body.menus[0].meals[0].image).to.equal(existingMeal.image);
          expect(resp.body.menus[0].meals.length).to.be.greaterThan(1);
          done();
        });
    });

    it('should contain meal objects for customer', (done) => {
      request(app)
        .get('/api/v1/menu')
        .set({
          'x-access-token': customerToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.menu).to.be.an('object');
          expect(resp.body.menu.meals).to.be.an('array');
          expect(resp.body.menu.meals[0].id).to.equal(1);
          expect(resp.body.menu.meals[0].name).to.equal(existingMeal.name);
          expect(resp.body.menu.meals[0].price).to.equal(existingMeal.price);
          expect(resp.body.menu.meals[0].image).to.equal(existingMeal.image);
          expect(resp.body.menu.meals.length).to.be.greaterThan(1);
          done();
        });
    });
  });
});
