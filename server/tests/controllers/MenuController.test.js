import { expect } from 'chai';
import request from 'supertest';
import app from '../../server';
import Authenticate from '../../utils/authentication/authenticate';
import { getNormalDate, beautifyDate } from '../../utils/dateBeautifier';
import { transporter } from '../../utils/mailer/NodeMailer';

import {
  menuFor22April18,
  currentMenu,
  insertSeedMenu,
  clearMenus,
  menuFor23April18,
  menuFor24April18,
} from '../../utils/seeders/menuSeeder';

import {
  riceAndStew,
  crispyChicken,
  curryRice,
  insertSeedMeal,
  clearMeals,
} from '../../utils/seeders/mealSeeder';

import {
  userMatthew,
  existingUser,
  insertSeedUsers,
  userJane,
  userStephen,
  clearUsers,
} from '../../utils/seeders/userSeeder';

transporter.sendMail = () => Promise.resolve(1);

/* eslint-disable no-undef */
describe('Test Suite for Menu Controller', () => {
  before(async () => {
    // create existing users
    await clearUsers();
    await insertSeedUsers(existingUser);
    await insertSeedUsers(userMatthew);
    await insertSeedUsers(userJane);
    await insertSeedUsers(userStephen);
  });

  // generate access token for users
  const alphaCatererToken = Authenticate.authenticateUser({ id: 1, ...existingUser });
  const customerToken = Authenticate.authenticateUser({ id: 2, ...userMatthew });
  const betaCatererToken = Authenticate.authenticateUser({ id: 3, ...userJane });
  const adminToken = Authenticate.authenticateUser({ id: 4, ...userStephen });

  describe('POST: Create Menu - /api/v1/menu', () => {
    // before each hook to clean and insert data to the db
    beforeEach(async () => {
      await clearMeals();
      await clearMenus();
      await insertSeedMeal(curryRice);
      await insertSeedMeal(riceAndStew);
      await insertSeedMeal(crispyChicken);
      await insertSeedMenu(menuFor22April18);
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

    it('should not allow customer create a menu', (done) => {
      request(app)
        .post('/api/v1/menu')
        .set({
          'x-access-token': customerToken,
        })
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(403);
          expect(resp.body.message).to.equal('User not allowed to perform this operation');
          done();
        });
    });

    it('should create menu with current date by default', (done) => {
      request(app)
        .post('/api/v1/menu')
        .set({
          'x-access-token': alphaCatererToken,
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
          'x-access-token': alphaCatererToken,
        })
        .send({ mealIds: [1, 2] })
        .end((err, resp) => {
          expect(resp.body.errors.menu.statusCode).to.equal(409);
          expect(resp.body.errors.menu.message).to.equal('Menu for the day already exists');
        });
    });

    it('should require mealIds to be submitted with request', (done) => {
      request(app)
        .post('/api/v1/menu')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .send({
        })
        .end((err, resp) => {
          expect(resp.body.errors.meals.statusCode).to.equal(400);
          expect(resp.body.errors.meals.message).to.equal('Array of meal ids is required');
          done();
        });
    });

    it('should require mealIds parameter to be an array', (done) => {
      request(app)
        .post('/api/v1/menu')
        .set({
          'x-access-token': alphaCatererToken,
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

    it('should not allow a string as mealIds', (done) => {
      request(app)
        .post('/api/v1/menu')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .send({
          mealIds: '1, 2',
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
          'x-access-token': alphaCatererToken,
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

    it('should not add meals to menu if meals array contains non existing meals', (done) => {
      request(app)
        .post('/api/v1/menu')
        .set({
          'x-access-token': alphaCatererToken,
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
          'x-access-token': betaCatererToken,
        })
        .send({
          mealIds: [3],
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
      await insertSeedMeal(curryRice);
      await insertSeedMeal(riceAndStew);
      await insertSeedMeal(crispyChicken);
      await insertSeedMenu(menuFor22April18);
    });

    it('should require an authentication token', (done) => {
      request(app)
        .put('/api/v1/menu/1')
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body.message).to.equal('Authentication failed. No token provided');
          done();
        });
    });

    it('should require a valid authentication token', (done) => {
      request(app)
        .put('/api/v1/menu/1')
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

    it('should not allow customers update a menu', (done) => {
      request(app)
        .put('/api/v1/menu/1')
        .set({
          'x-access-token': customerToken,
        })
        .send({})
        .end((err, resp) => {
          expect(resp.status).to.equal(403);
          expect(resp.body.message).to.equal('User not allowed to perform this operation');
          done();
        });
    });

    it('should require a valid menu id', (done) => {
      request(app)
        .put('/api/v1/menu/ab')
        .set({
          'x-access-token': alphaCatererToken,
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
          'x-access-token': alphaCatererToken,
        })
        .send({
        })
        .end((err, resp) => {
          expect(resp.body.errors.id.statusCode).to.equal(400);
          expect(resp.body.errors.id.message).to.equal('Menu does not exist');
          done();
        });
    });

    it('should require mealIds to be submitted with request', (done) => {
      request(app)
        .put('/api/v1/menu/1')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .send({
        })
        .end((err, resp) => {
          expect(resp.body.errors.meals.statusCode).to.equal(400);
          expect(resp.body.errors.meals.message).to.equal('Array of meal ids is required');
          done();
        });
    });

    it('should require mealIds parameter to be an array', (done) => {
      request(app)
        .put('/api/v1/menu/1')
        .set({
          'x-access-token': alphaCatererToken,
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

    it('should not allow mealIds to be a string', (done) => {
      request(app)
        .put('/api/v1/menu/1')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .send({
          mealIds: '1, 2, 3',
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
          'x-access-token': alphaCatererToken,
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
          'x-access-token': alphaCatererToken,
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
          'x-access-token': alphaCatererToken,
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
      await insertSeedMeal(curryRice);
      await insertSeedMeal(riceAndStew);
      await insertSeedMeal(crispyChicken);
      await insertSeedMenu({ ...currentMenu, mealIds: [1, 2] });
      await insertSeedMenu(menuFor22April18);
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
          'x-access-token': alphaCatererToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.menus).to.be.an('array');
          expect(resp.body.menus[0].id).to.equal(2);
          expect(resp.body.menus[0].name).to.equal(menuFor22April18.name);
          expect(resp.body.menus[0].date).to.equal(menuFor22April18.date);
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
          'x-access-token': alphaCatererToken,
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
          expect(resp.body.menu.meals[0].name).to.equal(curryRice.name);
          expect(resp.body.menu.meals[0].price).to.equal(curryRice.price);
          expect(resp.body.menu.meals[0].image).to.equal(curryRice.image);
          expect(resp.body.menu.meals.length).to.be.greaterThan(1);
          done();
        });
    });

    it('should contain meal objects for caterer when getting a single menu', (done) => {
      request(app)
        .get('/api/v1/menu/1')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.menu).to.be.an('object');
          expect(resp.body.menu.meals).to.be.an('array');
          expect(resp.body.menu.meals[0].id).to.equal(1);
          expect(resp.body.menu.meals[0].name).to.equal(curryRice.name);
          expect(resp.body.menu.meals[0].price).to.equal(curryRice.price);
          expect(resp.body.menu.meals[0].image).to.equal(curryRice.image);
          expect(resp.body.menu.meals.length).to.be.greaterThan(1);
          done();
        });
    });
  });

  describe('Test suite for pagination', () => {
    beforeEach(async () => {
      await clearMenus();
      await clearMeals();
      await insertSeedMeal(curryRice);
      await insertSeedMeal(riceAndStew);
      await insertSeedMeal(crispyChicken);
      await insertSeedMenu(menuFor22April18);
      await insertSeedMenu(menuFor23April18);
      await insertSeedMenu(menuFor24April18);
      await insertSeedMenu({ ...currentMenu, mealIds: [1, 2] });
    });
    it('should return paginated meals object for customer', (done) => {
      request(app)
        .get('/api/v1/menu?offset=0&limit=1')
        .set({
          'x-access-token': customerToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.pagination).to.be.an('object');
          expect(resp.body.pagination.totalCount).to.equal(2);
          expect(resp.body.pagination.limit).to.equal(1);
          expect(resp.body.pagination.offset).to.equal(0);
          expect(resp.body.pagination.noPage).to.equal(2);
          expect(resp.body.pagination.pageNo).to.equal(1);
          expect(resp.body.menu.meals[0].id).to.equal(1);
          expect(resp.body.menu.meals[0].name).to.equal(curryRice.name);
          expect(resp.body.menu.meals[0].price).to.equal(curryRice.price);
          expect(resp.body.menu.meals[0].image).to.equal(curryRice.image);
          done();
        });
    });
    it('should return paginated meals object for caterer', (done) => {
      request(app)
        .get('/api/v1/menu?offset=0&limit=2')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.pagination).to.be.an('object');
          expect(resp.body.pagination.totalCount).to.equal(4);
          expect(resp.body.pagination.limit).to.equal(2);
          expect(resp.body.pagination.offset).to.equal(0);
          expect(resp.body.pagination.noPage).to.equal(2);
          expect(resp.body.pagination.pageNo).to.equal(1);
          done();
        });
    });
    it('should return paginated meals object for caterer when getting single menu', (done) => {
      request(app)
        .get('/api/v1/menu/4?offset=0&limit=1')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.pagination).to.be.an('object');
          expect(resp.body.pagination.totalCount).to.equal(2);
          expect(resp.body.pagination.limit).to.equal(1);
          expect(resp.body.pagination.offset).to.equal(0);
          expect(resp.body.pagination.noPage).to.equal(2);
          expect(resp.body.pagination.pageNo).to.equal(1);
          expect(resp.body.menu.meals[0].id).to.equal(1);
          expect(resp.body.menu.meals[0].name).to.equal(curryRice.name);
          expect(resp.body.menu.meals[0].price).to.equal(curryRice.price);
          expect(resp.body.menu.meals[0].image).to.equal(curryRice.image);
          done();
        });
    });
  });

  describe('Limit and Offset Validation', () => {
    it('should return error if limit or offset is invalid', (done) => {
      request(app)
        .get('/api/v1/menu?limit=abc&offset=xyz')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .end((err, resp) => {
          expect(resp.body.errors.limit.statusCode).to.equal(400);
          expect(resp.body.errors.limit.message).to.equal('Limit is invalid');
          expect(resp.body.errors.offset.statusCode).to.equal(400);
          expect(resp.body.errors.offset.message).to.equal('Offset is invalid');
          done();
        });
    });
  });
});
