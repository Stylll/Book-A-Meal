import { expect } from 'chai';
import bcrypt from 'bcrypt';
import users from '../../db/users';
import {
  existingUser,
  validUser1,
  validUser2,
  invalidUser,
  insertSeedUsers,
  clearUsers,
} from '../../utils/seeders/userSeeder';

/* eslint-disable no-undef */
describe('Test Suite for users db model', () => {
  beforeEach(() => {
    clearUsers();
    insertSeedUsers(existingUser);
  });
  it('should add new user to db', () => {
    users.add(validUser1);
    expect(users.getByEmail(validUser1.email).email).to.equal(validUser1.email);
  });

  it('should require email', () => {
    const result = users.add({ email: '   ' });
    expect(result.err.message).to.equal('Email is required');
  });

  it('should require a valid email', () => {
    const result = users.add(invalidUser);
    expect(result.err.message).to.equal('Email is invalid');
  });

  it('should require a unique email', () => {
    const result = users.add(existingUser);
    expect(result.err.message).to.equal('Email exists');
  });

  it('should require a username', () => {
    const result = users.add({ email: validUser1.email, username: '  ' });
    expect(result.err.message).to.equal('Username is required');
  });

  it('should require a unique username', () => {
    const result = users.add({ email: validUser2.email, username: existingUser.username });
    expect(result.err.message).to.equal('Username exists');
  });

  it('should require a password', () => {
    const result = users.add({ email: validUser1.email, username: validUser1.username, password: '  ' });
    expect(result.err.message).to.equal('Password is required');
  });

  it('should require a valid password', () => {
    const result = users.add({
      email: validUser1.email, username: validUser1.username, password: invalidUser.password,
    });
    expect(result.err.message).to.equal('Password must have atleast 5 characters');
  });

  it('should add bulk users to the db', () => {
    users.addBulk([validUser1, validUser2]);
    expect(users.getAll().length).to.equal(3);
  });

  it('should store hash password after adding', () => {
    users.add(validUser1);
    const hashPassword = users.getByEmail(validUser1.email).password;
    expect(bcrypt.compareSync(validUser1.password, hashPassword));
  });

  it('should update user password', () => {
    const testUser = existingUser;
    testUser.password = 'Newpassword';
    testUser.id = 1;
    users.update(testUser);
    const hashPassword = users.getByEmail(existingUser.email).password;
    expect(bcrypt.compareSync(testUser.password, hashPassword));
  });

  it('should get user by email', () => {
    users.add(validUser1);
    expect(users.getByEmail(validUser1.email).email).to.equal(validUser1.email);
  });

  it('should get user by username', () => {
    users.add(validUser1);
    expect(users.getByUsername(validUser1.username).username).to.equal(validUser1.username);
  });

  it('should get user by id', () => {
    expect(users.get(1).email).to.equal(existingUser.email);
  });

  it('should delete user from db', () => {
    users.delete(1);
    expect(users.getByEmail(existingUser.email)).to.equal(null);
  });

  it('should get all users in the db', () => {
    users.add(validUser2);
    expect(users.getAll().length).to.equal(2);
  });

  it('should truncate users model in the db', () => {
    users.truncate();
    expect(users.getAll().length).to.equal(0);
  });
});
