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
          mealId: 0,
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
          mealId: 0,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body.message).to.equal('Meal id is not valid');
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
          expect(resp.body.menuMeal.mealId).to.equal(1);
          expect(resp.body.menuMeal).to.haveOwnProperty('createdAt');
          expect(resp.body.menuMeal).to.haveOwnProperty('updatedAt');
          expect(resp.body.menuMeal).to.haveOwnProperty('id');
          done();
        });
    });
  });
});
