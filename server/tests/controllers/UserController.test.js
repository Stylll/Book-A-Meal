import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import request from 'supertest';
import app from '../../server';
import {
  validUser1,
  validUser2,
  existingUser,
  invalidUser,
  insertSeedUsers,
  clearUsers,
} from '../../utils/seeders/userSeeder';

dotenv.config();

/* eslint-disable no-undef */
describe('Test suite for User Controller', () => {
  beforeEach(() => {
    clearUsers();
    insertSeedUsers(existingUser);
  });

  describe('POST: Signup User - /api/v1/users/signup', () => {
    it('should create account with valid email, username, password and account type', (done) => {
      request(app)
        .post('/api/v1/users/signup')
        .send(validUser1)
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          done();
        });
    });

    it('should require a valid email', (done) => {
      request(app)
        .post('/api/v1/users/signup')
        .send(invalidUser)
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body).to.haveOwnProperty('message');
          expect(resp.body.message).to.equal('Email is invalid');
        });

      request(app)
        .post('/api/v1/users/signup')
        .send({
          email: '  ',
          username: invalidUser.username,
          password: invalidUser.password,
          accountType: invalidUser.accountType,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body).to.haveOwnProperty('message');
          expect(resp.body.message).to.equal('Email is required');
          done();
        });
    });

    it('should require a username', (done) => {
      request(app)
        .post('/api/v1/users/signup')
        .send({
          email: validUser1.email,
          username: '  ',
          password: invalidUser.password,
          accountType: invalidUser.accountType,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body).to.haveOwnProperty('message');
          expect(resp.body.message).to.equal('Username is required');
          done();
        });
    });

    it('should require a valid password', (done) => {
      request(app)
        .post('/api/v1/users/signup')
        .send({
          email: validUser1.email,
          username: validUser1.username,
          password: invalidUser.password,
          accountType: invalidUser.accountType,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body).to.haveOwnProperty('message');
          expect(resp.body.message).to.equal('Password must have atleast 6 characters');
        });

      request(app)
        .post('/api/v1/users/signup')
        .send({
          email: validUser1.email,
          username: validUser1.username,
          password: '   ',
          accountType: invalidUser.accountType,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body).to.haveOwnProperty('message');
          expect(resp.body.message).to.equal('Password is required');
          done();
        });
    });

    it('should require a valid account type', (done) => {
      request(app)
        .post('/api/v1/users/signup')
        .send({
          email: validUser1.email,
          username: validUser1.username,
          password: validUser1.password,
          accountType: invalidUser.accountType,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body).to.haveOwnProperty('message');
          expect(resp.body.message).to.equal('Account type is invalid');
        });

      request(app)
        .post('/api/v1/users/signup')
        .send({
          email: validUser1.email,
          username: validUser1.username,
          password: validUser1.password,
          accountType: '   ',
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body).to.haveOwnProperty('message');
          expect(resp.body.message).to.equal('Account type is required');
          done();
        });
    });

    it('should not create account with existing email', (done) => {
      request(app)
        .post('/api/v1/users/signup')
        .send(existingUser)
        .end((err, resp) => {
          expect(resp.status).to.equal(409);
          expect(resp.body).to.haveOwnProperty('message');
          expect(resp.body.message).to.equal('Email already exists. Try another one.');
          done();
        });
    });

    it('should not create account with existing username', (done) => {
      request(app)
        .post('/api/v1/users/signup')
        .send({
          email: validUser1.email,
          username: existingUser.username,
          password: validUser1.password,
          accountType: validUser1.accountType,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(409);
          expect(resp.body).to.haveOwnProperty('message');
          expect(resp.body.message).to.equal('Username already exists. Try another one.');
          done();
        });
    });

    it('should return response data and code in correct form for valid sign up', (done) => {
      request(app)
        .post('/api/v1/users/signup')
        .send(validUser1)
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          expect(resp.body.user).to.haveOwnProperty('id');
          expect(resp.body.user).to.haveOwnProperty('email');
          expect(resp.body.user).to.haveOwnProperty('username');
          expect(resp.body.user).to.haveOwnProperty('accountType');
          expect(resp.body.user.email).to.equal(validUser1.email);
          expect(resp.body.user.username).to.equal(validUser1.username);
          expect(resp.body.user.accountType).to.equal(validUser1.accountType);
          done();
        });
    });

    it('should return a valid jwt token after signup', (done) => {
      request(app)
        .post('/api/v1/users/signup')
        .send(validUser2)
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          expect(resp.body).to.haveOwnProperty('token');
          expect(jwt.verify(resp.body.token, process.env.SECRET)).to.not.equal(null);
          done();
        });
    });
  });

  describe('POST Signin User - /api/v1/users/signin', () => {
    it('should require an email', (done) => {
      request(app)
        .post('/api/v1/users/signin')
        .send({ email: '   ' })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body).to.haveOwnProperty('message');
          expect(resp.body.message).to.equal('Email is required');
          done();
        });
    });

    it('should require a valid email', (done) => {
      request(app)
        .post('/api/v1/users/signin')
        .send({ email: invalidUser.email })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body).to.haveOwnProperty('message');
          expect(resp.body.message).to.equal('Email is invalid');
          done();
        });
    });

    it('should require a password', (done) => {
      request(app)
        .post('/api/v1/users/signin')
        .send({ email: existingUser.email, password: '   ' })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body).to.haveOwnProperty('message');
          expect(resp.body.message).to.equal('Password is required');
          done();
        });
    });

    it('should return proper response data and status code for authenticated users', (done) => {
      request(app)
        .post('/api/v1/users/signin')
        .send(existingUser)
        .end((err, resp) => {
          expect(resp.status).to.equal(200);
          expect(resp.body).to.haveOwnProperty('user');
          expect(resp.body.user).to.haveOwnProperty('id');
          expect(resp.body.user).to.haveOwnProperty('email');
          expect(resp.body.user).to.haveOwnProperty('username');
          expect(resp.body.user).to.haveOwnProperty('accountType');
          expect(resp.body).to.haveOwnProperty('token');
          expect(jwt.verify(resp.body.token, process.env.SECRET)).to.not.equal(null);
          done();
        });
    });

    it('should not grant access to wrong credentials', (done) => {
      request(app)
        .post('/api/v1/users/signin')
        .send(validUser2)
        .end((err, resp) => {
          expect(resp.status).to.equal(401);
          expect(resp.body).to.haveOwnProperty('message');
          expect(resp.body.message).to.equal('Email or Password is incorrect');
          done();
        });
    });
  });
});
