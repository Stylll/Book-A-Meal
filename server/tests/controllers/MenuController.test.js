import { expect } from 'chai';
import request from 'supertest';
import app from '../../server';
import menus from '../../db/menus';
import Authenticate from '../../utils/authentication/authenticate';
import { getNormalDate, beautifyDate } from '../../utils/dateBeautifier';
import {
  validMenuMeal1,
  validMenuMeal2,
  invalidMenuMeal3,
  existingMenuMeal,
  insertSeedMenuMeal,
  clearMenuMeals,
} from '../../utils/seeders/menuMealSeeder';

import {
  validMenu1,
  validMenu2,
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
  insertSeedUsers
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
      clearMenus();
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

    it('should require a caterer user account', (done) => {
      request(app)
        .post('/api/v1/menu')
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

    it('should create menu with current date', (done) => {
      request(app)
        .post('/api/v1/menu')
        .set({
          'x-access-token': catererToken,
        })
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          expect(resp.body).to.haveOwnProperty('menu');
          expect(resp.body.menu.date).to.equal(getNormalDate(new Date()));
          expect(resp.body.menu.name).to.equal(`Menu For ${beautifyDate(new Date())}`);
          expect(resp.body.menu).to.haveOwnProperty('createdAt');
          expect(resp.body.menu).to.haveOwnProperty('updatedAt');
          expect(resp.body.menu.userId).to.equal(1);
          done();
        });
    });
  });

  describe('POST: Create Menu Meal - /api/v1/menu/:id/meals', () => {
    // before each hook to clean and insert data to the db
    beforeEach(() => {
      clearMenus();
      clearMeals();
      clearMenuMeals();
      insertSeedMenu(existingMenu);
      insertSeedMeal(existingMeal);
      insertSeedMeal(validMeal1);
      insertSeedMenuMeal(existingMenuMeal);
    });

    it('should require an authentication token', (done) => {
      request(app)
        .post('/api/v1/menu/1/meals')
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body.message).to.equal('Authentication failed. No token provided');
          done();
        });
    });

    it('should require a valid authentication token', (done) => {
      request(app)
        .post('/api/v1/menu/1/meals')
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
        .post('/api/v1/menu/1/meals')
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

    it('should require existing menu id', (done) => {
      request(app)
        .post('/api/v1/menu/21/meals')
        .set({
          'x-access-token': catererToken,
        })
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(404);
          expect(resp.body.message).to.equal('Menu does not exist');
          done();
        });
    });

    it('should require valid menu id', (done) => {
      request(app)
        .post('/api/v1/menu/abc/meals')
        .set({
          'x-access-token': catererToken,
        })
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Menu id is invalid');
          done();
        });
    });

    it('should require meal id', (done) => {
      request(app)
        .post('/api/v1/menu/1/meals')
        .set({
          'x-access-token': catererToken,
        })
        .send({
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Meal id is required');
          done();
        });
    });

    it('should require existing meal', (done) => {
      request(app)
        .post('/api/v1/menu/1/meals')
        .set({
          'x-access-token': catererToken,
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

    it('should require valid meal id', (done) => {
      request(app)
        .post('/api/v1/menu/1/meals')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          mealId: 'avc',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Meal id is invalid');
          done();
        });
    });

    it('should require unique meal id', (done) => {
      request(app)
        .post('/api/v1/menu/1/meals')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          mealId: 1,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(409);
          expect(resp.body.message).to.equal('Meal already exists');
          done();
        });
    });

    it('should add meal to menu', (done) => {
      request(app)
        .post('/api/v1/menu/1/meals')
        .set({
          'x-access-token': catererToken,
        })
        .send({
          mealId: 2,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          expect(resp.body.menuMeal.menuId).to.equal(1);
          expect(resp.body.menuMeal.mealId).to.equal(2);
          expect(resp.body.menuMeal).to.haveOwnProperty('createdAt');
          expect(resp.body.menuMeal).to.haveOwnProperty('updatedAt');
          expect(resp.body.menuMeal).to.haveOwnProperty('id');
          done();
        });
    });
  });

  describe('GET: Get Menu - /api/v1/menu', () => {
    // before each hook to clean and insert data to the db
    beforeEach(() => {
      clearMenus();
      clearMeals();
      clearMenuMeals();
      insertSeedMenu(currentMenu);
      insertSeedMenu(existingMenu);
      insertSeedMeal(existingMeal);
      insertSeedMeal(validMeal1);
      insertSeedMeal(validMeal2);
      insertSeedMenuMeal(existingMenuMeal);
      insertSeedMenuMeal({ menuId: 1, mealId: 2 });
      insertSeedMenuMeal({ menuId: 1, mealId: 3 });
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
          expect(resp.body.menus).to.be.an('object');
          expect(resp.body.menus.meals).to.be.an('array');
          expect(resp.body.menus.meals[0].id).to.equal(1);
          expect(resp.body.menus.meals[0].name).to.equal(existingMeal.name);
          expect(resp.body.menus.meals[0].price).to.equal(existingMeal.price);
          expect(resp.body.menus.meals[0].image).to.equal(existingMeal.image);
          expect(resp.body.menus.meals.length).to.be.greaterThan(1);
          done();
        });
    });
  });
});
