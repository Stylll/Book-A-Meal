import { expect } from 'chai';
import request from 'supertest';
import app from '../../server';
import {
  validUser1,
  validUser2,
  existingUser,
  invalidUser,
} from '../../utils/seeder';

/* eslint-disable no-undef */
describe('Test suite for User Controller', () => {
  describe('POST: Signup User - /api/v1/signup', () => {
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
          done();
        });
    });

    it('should require a valid username', (done) => {
      request(app)
        .post('/api/v1/users/signup')
        .send({
          email: validUser1.email,
          username: invalidUser.username,
          password: invalidUser.password,
          accountType: invalidUser.accountType,
        })
        .end((err, resp) => {
          expect(resp.status).to.equal(400);
          expect(resp.body).to.haveOwnProperty('message');
          expect(resp.body.message).to.equal('Username is invalid');
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
          expect(resp.body.message).to.equal('Password is invalid');
          done();
        });
    });

    it('should not require a valid account type', (done) => {
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
        .post('api/v1/users/signup')
        .send(validUser1)
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          expect(resp.body).to.haveOwnProperty('email');
          expect(resp.body).to.haveOwnProperty('username');
          expect(resp.body).to.haveOwnProperty('password');
          expect(resp.body).to.haveOwnProperty('accountType');
          expect(resp.body.email).to.equal(validUser1.email);
          expect(resp.body.username).to.equal(validUser1.username);
          expect(resp.body.password).to.equal(validUser1.password);
          expect(resp.body.accountType).to.equal(validUser1.accountType);
          done();
        });
    });

    it('should return a valid jwt token after signup', (done) => {
      request(app)
        .post('api/v1/users/signup')
        .send(validUser1)
        .end((err, resp) => {
          expect(resp.status).to.equal(201);
          expect(resp.body).to.haveOwnProperty('token');
          // check using jwt if token is valid
          done();
        });
    });
  });
});
