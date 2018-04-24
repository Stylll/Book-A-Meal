import { expect } from 'chai';
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


/* eslint-disable no-undef */
describe('Test Suite for Meal Controller', () => {

  describe('POST: Create Meal - /api/v1/meals', () => {

    beforeEach(() => {
      insertSeedUsers(validUser1);
      insertSeedUsers(validUser2);
    });

    it('should require a caterer');

    it('should require meal name');

    it('should require a unique meal name');

    it('should require meal price');

    it('should set default image if image is not provided');

    it('should create a meal');
  });
});
