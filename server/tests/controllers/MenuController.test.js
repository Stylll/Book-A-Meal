import { expect } from 'chai';
import request from 'supertest';
import app from '../../server';
import Authenticate from '../../utils/authentication/authenticate';
import { getNormalDate, beautifyDate } from '../../utils/dateBeautifier';

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
} from '../../utils/seeders/userSeeder';

/* eslint-disable no-undef */
describe('Test Suite for Menu Controller', () => {
  // create existing users
  insertSeedUsers(existingUser);
  insertSeedUsers(validUser1);

  // generate access token for users
  const catererToken = Authenticate.authenticateUser({ id: 1, ...existingUser });
  const customerToken = Authenticate.authenticateUser({ id: 2, ...validUser1 });

  describe('POST: Create Menu - /api/v1/menu', () => {
    // before each hook to clean and insert data to the db
    beforeEach(() => {
      clearMeals();
      clearMenus();
      insertSeedMenu(existingMenu);
      insertSeedMeal(existingMeal);
      insertSeedMeal(validMeal1);
      insertSeedMeal(validMeal2);
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
      clearMenus();
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
          expect(resp.body.menu).to.haveOwnProperty('createdAt');
          expect(resp.body.menu).to.haveOwnProperty('updatedAt');
          expect(resp.body.menu).to.haveOwnProperty('mealIds');
          expect(resp.body.menu.mealIds).to.eql([1, 2]);
          expect(resp.body.menu.userId).to.equal(1);
          done();
        });
    });

    it('should not create multiple menus for the same day', (done) => {
      insertSeedMenu(currentMenu);
      request(app)
        .post('/api/v1/menu')
        .set({
          'x-access-token': catererToken,
        })
        .send({ mealIds: [1, 2] })
        .end((err, resp) => {
          expect(resp.status).to.equal(409);
          expect(resp.body.message).to.equal('Menu for the day already exists');
          done();
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
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Array of meal ids is required');
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
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Meal ids must be in an array');
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

    it('should add only existing meals to menu', (done) => {
      request(app)
        .post('/api/v1/menu')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          mealIds: [1, 2, 5, 7, 8],
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          expect(resp.body.menu.mealIds[0]).to.equal(1);
          expect(resp.body.menu.mealIds[1]).to.equal(2);
          expect(resp.body.menu).to.haveOwnProperty('createdAt');
          expect(resp.body.menu).to.haveOwnProperty('updatedAt');
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
    beforeEach(() => {
      clearMeals();
      clearMenus();
      insertSeedMeal(existingMeal);
      insertSeedMeal(validMeal1);
      insertSeedMeal(validMeal2);
      insertSeedMenu(existingMenu);
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
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Menu id is invalid');
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
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Menu does not exist');
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
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Array of meal ids is required');
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
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Meal ids must be in an array');
          done();
        });
    });

    it('should save unique meal ids', (done) => {
      request(app)
        .put('/api/v1/menu/1')
        .set({
          'x-access-token': catererToken,
        })
        .send({ mealIds: [1, 1, 2, 2, 'a'] })
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          expect(resp.body.menu.mealIds[0]).to.equal(1);
          expect(resp.body.menu.mealIds[1]).to.equal(2);
          expect(resp.body.menu.mealIds).to.eql([1, 2]);
          done();
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
          expect(resp.status).to.equal(201);
          expect(resp.body.menu.mealIds[0]).to.equal(1);
          expect(resp.body.menu.mealIds[1]).to.equal(2);
          expect(resp.body.menu).to.haveOwnProperty('createdAt');
          expect(resp.body.menu).to.haveOwnProperty('updatedAt');
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

  describe('GET: Get Menu - /api/v1/menu', () => {
    // before each hook to clean and insert data to the db
    beforeEach((done) => {
      clearMenus();
      clearMeals();
      insertSeedMeal(existingMeal);
      insertSeedMeal(validMeal1);
      insertSeedMeal(validMeal2);
      insertSeedMenu({ ...currentMenu, mealIds: [1, 2] });
      insertSeedMenu(existingMenu);
      done();
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
          expect(resp.body.menus[0].id).to.equal(1);
          expect(resp.body.menus[0].name).to.equal(currentMenu.name);
          expect(resp.body.menus[0].date).to.equal(currentMenu.date);
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

    it('should return empty array if no menu exists when caterer requests', (done) => {
      clearMenus();
      request(app)
        .get('/api/v1/menu')
        .set({
          'x-access-token': catererToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.menus).to.be.an('array');
          expect(resp.body.menus.length).to.equal(0);
          done();
        });
    });

    it('should show error message if no menu exists when customer requests', (done) => {
      clearMenus();
      request(app)
        .get('/api/v1/menu')
        .set({
          'x-access-token': customerToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(404);
          expect(resp.body.message).to.equal('Menu for the day not set');
          done();
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
