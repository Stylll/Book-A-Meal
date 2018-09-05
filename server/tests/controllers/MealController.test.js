import { expect } from 'chai';
import request from 'supertest';
import app from '../../server';
import meals from '../../db/meals';
import CloudUpload from '../../utils/cloudUpload';
import Authenticate from '../../utils/authentication/authenticate';
import {
  defaultImage,
  riceAndStew,
  crispyChicken,
  curryRice,
  insertSeedMeal,
  clearMeals,
} from '../../utils/seeders/mealSeeder';
import {
  existingUser,
  insertSeedUsers,
  userMatthew,
  userJane,
  userStephen,
  clearUsers,
} from '../../utils/seeders/userSeeder';

/* Mock imageupload function */
const originalUploadImage = CloudUpload.uploadImage;
CloudUpload.uploadImage = source => 'https://mockimagefile.com';


/* eslint-disable no-undef */
describe('Test Suite for Meal Controller', () => {
  // create existing users
  before(async () => {
    await clearUsers();
    await insertSeedUsers(existingUser);
    await insertSeedUsers(userMatthew);
    await insertSeedUsers(userJane);
    await insertSeedUsers(userStephen);
  });

  // generate access token for users
  const alphaCatererToken = Authenticate.authenticateUser({ id: 1, ...existingUser });
  const betaCatererToken = Authenticate.authenticateUser({ id: 5, ...existingUser });
  const customerToken = Authenticate.authenticateUser({ id: 2, ...userMatthew });
  const adminToken = Authenticate.authenticateUser({ id: 4, ...userStephen });

  describe('POST: Create Meal - /api/v1/meals', () => {
    // before each hook to clean and insert data to the db
    beforeEach(async () => {
      await clearMeals();
      await insertSeedMeal(curryRice);
    });

    it('should require a token', (done) => {
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

    it('should not allow customer create meals', (done) => {
      request(app)
        .post('/api/v1/meals')
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

    it('should require meal name', (done) => {
      request(app)
        .post('/api/v1/meals')
        .set({
          'x-access-token': alphaCatererToken,
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
          'x-access-token': alphaCatererToken,
        })
        .send(curryRice)
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
          'x-access-token': alphaCatererToken,
        })
        .send({
          name: riceAndStew.name,
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
          'x-access-token': alphaCatererToken,
        })
        .send({
          name: riceAndStew.name,
          price: 'Three zero',
        })
        .end((err, resp) => {
          expect(resp.body.errors.price.statusCode).to.equal(400);
          expect(resp.body.errors.price.message).to.equal('Price is invalid');
          done();
        });
    });

    it('should require meal price above zero', (done) => {
      request(app)
        .post('/api/v1/meals')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .send({
          name: riceAndStew.name,
          price: 0.8,
        })
        .end((err, resp) => {
          expect(resp.body.errors.price.statusCode).to.equal(400);
          expect(resp.body.errors.price.message).to.equal('Price must be atleast 1');
          done();
        });
    });

    it('should set default image if image is not provided', (done) => {
      request(app)
        .post('/api/v1/meals')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .send({
          name: crispyChicken.name,
          price: crispyChicken.price,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          expect(resp.body).to.haveOwnProperty('meal');
          expect(resp.body.meal.image).to.equal(defaultImage);
          done();
        });
    });

    it(
      'should call upload image function and create meal with image link',
      (done) => {
        request(app)
          .post('/api/v1/meals')
          .set({
            'x-access-token': alphaCatererToken,
          })
          .set('Content-Type', 'multipart/form-data')
          .field('name', crispyChicken.name)
          .field('price', crispyChicken.price)
          .attach('image', `${__dirname}/../assets/alert.png`)
          .end((err, resp) => {
            expect(resp.status).to.equal(201);
            expect(resp.body).to.haveOwnProperty('meal');
            expect(resp.body.meal.image).to.equal('https://mockimagefile.com');
            done();
          });
      },
    );

    after((done) => {
      CloudUpload.uploadImage = originalUploadImage;
      done();
    });

    it('should return meal with proper objects and proper status code', (done) => {
      request(app)
        .post('/api/v1/meals')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .send({
          name: crispyChicken.name,
          price: crispyChicken.price,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          expect(resp.body).to.haveOwnProperty('meal');
          expect(resp.body.meal.name).to.equal(crispyChicken.name);
          expect(resp.body.meal.price).to.equal(crispyChicken.price);
          expect(resp.body.meal.image).to.equal(defaultImage);
          expect(resp.body.meal).to.haveOwnProperty('userId');
          expect(resp.body.meal.userId).to.not.equal(null);
          expect(resp.body.meal.userId).to.equal(1);
          done();
        });
    });

    it('should create meal with proper price when improper price is submitted', (done) => {
      request(app)
        .post('/api/v1/meals')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .send({
          name: crispyChicken.name,
          price: '00002500',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          expect(resp.body).to.haveOwnProperty('meal');
          expect(resp.body.meal.name).to.equal(crispyChicken.name);
          expect(resp.body.meal.price).to.equal(2500);
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
      await insertSeedMeal(curryRice);
      await insertSeedMeal(crispyChicken);
      await insertSeedMeal({ ...crispyChicken, name: 'Burger and fries', userId: 3 });
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

    it('should not allow customers update a meal', (done) => {
      request(app)
        .put('/api/v1/meals/1')
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

    it('should require existing meal using meal id', (done) => {
      request(app)
        .put('/api/v1/meals/30')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .send(riceAndStew)
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
          'x-access-token': alphaCatererToken,
        })
        .send(crispyChicken)
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
          'x-access-token': alphaCatererToken,
        })
        .send({
          ...riceAndStew,
          price: 'Three zero',
        })
        .end((err, resp) => {
          expect(resp.body.errors.price.statusCode).to.equal(400);
          expect(resp.body.errors.price.message).to.equal('Price is invalid');
          done();
        });
    });

    it('should require meal price to be atleast one', (done) => {
      request(app)
        .put('/api/v1/meals/1')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .send({
          name: riceAndStew.name,
          price: 0.89,
        })
        .end((err, resp) => {
          expect(resp.body.errors.price.statusCode).to.equal(400);
          expect(resp.body.errors.price.message).to.equal('Price must be atleast 1');
          done();
        });
    });

    it('should use previous image if image is not provided', (done) => {
      request(app)
        .put('/api/v1/meals/1')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .send({
          name: riceAndStew.name,
          price: crispyChicken.price,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body).to.haveOwnProperty('meal');
          expect(resp.body.meal.image).to.equal(defaultImage);
          done();
        });
    });

    it('should return updated meal with proper objects and proper status code', (done) => {
      crispyChicken.name = 'Jollof rice';
      crispyChicken.price = 4030;
      request(app)
        .put('/api/v1/meals/1')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .send({
          name: crispyChicken.name,
          price: crispyChicken.price,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body).to.haveOwnProperty('meal');
          expect(resp.body.meal.name).to.equal(crispyChicken.name);
          expect(resp.body.meal.price).to.equal(crispyChicken.price);
          expect(resp.body.meal.image).to.equal(defaultImage);
          expect(resp.body.meal).to.haveOwnProperty('userId');
          expect(resp.body.meal.userId).to.not.equal(null);
          expect(resp.body.meal.userId).to.equal(1);
          done();
        });
    });

    it('should return updated meal with proper price when improper price is submitted', (done) => {
      request(app)
        .put('/api/v1/meals/1')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .send({
          name: 'Porridge',
          price: '00004030',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body).to.haveOwnProperty('meal');
          expect(resp.body.meal.name).to.equal('Porridge');
          expect(resp.body.meal.price).to.equal(4030);
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
          'x-access-token': betaCatererToken,
        })
        .send({
          name: 'Jollof rice',
          price: 4030,
        })
        .end((err, resp) => {
          expect(resp.body.errors.access.statusCode).to.equal(403);
          expect(resp.body.errors.access.message).to.equal('User not allowed to perform this operation');
          done();
        });
    });
  });

  describe('GET: Get Meals - /api/v1/meals', () => {
    // before each hook to clean and insert data to the db
    beforeEach(async () => {
      await clearMeals();
      await insertSeedMeal(curryRice);
      await insertSeedMeal(riceAndStew);
      await insertSeedMeal({ ...crispyChicken, userId: 3 });
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

    it('should not allow customer get meals', (done) => {
      request(app)
        .get('/api/v1/meals')
        .set({
          'x-access-token': customerToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(403);
          expect(resp.body.message).to.equal('User not allowed to perform this operation');
          done();
        });
    });

    it('should return an array of meals created by the logged in user', (done) => {
      request(app)
        .get('/api/v1/meals')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.meals).to.be.an('array');
          expect(resp.body.meals[0])
            .to.have.all.deep.keys('id', 'name', 'price', 'image', 'userId');
          expect(resp.body.meals.length).to.equal(2);
          expect(resp.body.meals[0].name).to.equal(riceAndStew.name);
          expect(resp.body.meals[1].name).to.equal(curryRice.name);
          expect(resp.body.meals[1].userId).to.equal(1);
          expect(resp.body.meals[1].price).to.equal(curryRice.price);
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
          expect(resp.body.meals[0].name).to.equal(crispyChicken.name);
          expect(resp.body.meals[1].name).to.equal(riceAndStew.name);
          expect(resp.body.meals[2].name).to.equal(curryRice.name);
          expect(resp.body.meals[0].price).to.equal(crispyChicken.price);
          expect(resp.body.meals[1].price).to.equal(riceAndStew.price);
          expect(resp.body.meals[2].price).to.equal(curryRice.price);
          done();
        });
    });

    it('should not return null objects', async () => {
      await meals.delete(1);
      request(app)
        .get('/api/v1/meals')
        .set({
          'x-access-token': alphaCatererToken,
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
      await insertSeedMeal(curryRice);
      await insertSeedMeal(riceAndStew);
      await insertSeedMeal({ ...crispyChicken, userId: 3 });
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

    it('should not allow customer delete a meal', (done) => {
      request(app)
        .delete('/api/v1/meals/1')
        .set({
          'x-access-token': customerToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(403);
          expect(resp.body.message).to.equal('User not allowed to perform this operation');
          done();
        });
    });

    it('should require an existing meal', (done) => {
      request(app)
        .delete('/api/v1/meals/99')
        .set({
          'x-access-token': alphaCatererToken,
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
          'x-access-token': alphaCatererToken,
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
          'x-access-token': alphaCatererToken,
        })
        .end((err, resp) => {
          expect(resp.body.errors.access.statusCode).to.equal(403);
          expect(resp.body.errors.access.message).to.equal('User not allowed to perform this operation');
          done();
        });
    });
  });

  describe('Test for meal pagination A - GET', () => {
    beforeEach(async () => {
      await clearMeals();
      await insertSeedMeal(curryRice);
      await insertSeedMeal(riceAndStew);
      await insertSeedMeal(crispyChicken);
      await insertSeedMeal({ ...crispyChicken, name: 'Poundo Yam', userId: 4 });
    });

    it('should return paginated data for caterer', (done) => {
      request(app)
        .get('/api/v1/meals?limit=1&offset=0')
        .set({
          'x-access-token': alphaCatererToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.meals).to.be.an('array');
          expect(resp.body.meals.length).to.equal(1);
          expect(resp.body.meals[0].id).to.equal(3);
          expect(resp.body.meals[0].name).to.equal(crispyChicken.name);
          expect(resp.body.pagination.totalCount).to.equal(3);
          expect(resp.body.pagination.limit).to.equal(1);
          expect(resp.body.pagination.offset).to.equal(0);
          expect(resp.body.pagination.noPage).to.equal(3);
          expect(resp.body.pagination.pageNo).to.equal(1);
          done();
        });
    });
  });

  describe('Test for meal pagination B - GET', () => {
    beforeEach(async () => {
      await clearMeals();
      await insertSeedMeal(curryRice);
      await insertSeedMeal(riceAndStew);
      await insertSeedMeal({ ...crispyChicken, name: 'Poundo Yam', userId: 4 });
      await insertSeedMeal(crispyChicken);
    });

    it('should return paginated data for admin caterer', (done) => {
      request(app)
        .get('/api/v1/meals?limit=1&offset=0')
        .set({
          'x-access-token': adminToken,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body.meals).to.be.an('array');
          expect(resp.body.meals.length).to.equal(1);
          expect(resp.body.meals[0].id).to.equal(4);
          expect(resp.body.meals[0].name).to.equal(crispyChicken.name);
          expect(resp.body.pagination.totalCount).to.equal(4);
          expect(resp.body.pagination.limit).to.equal(1);
          expect(resp.body.pagination.offset).to.equal(0);
          expect(resp.body.pagination.noPage).to.equal(4);
          expect(resp.body.pagination.pageNo).to.equal(1);
          done();
        });
    });
  });

  describe('Limit and Offset Validation', () => {
    it('should return error if limit or offset is invalid', (done) => {
      request(app)
        .get('/api/v1/meals?limit=abc&offset=xyz')
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
