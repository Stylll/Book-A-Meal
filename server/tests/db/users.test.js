import 'babel-polyfill';
import { expect } from 'chai';
import bcrypt from 'bcrypt';
import users from '../../db/users';
import {
  existingUser,
  userMatthew,
  userJane,
  invalidUser,
  insertSeedUsers,
  clearUsers,
} from '../../utils/seeders/userSeeder';

/* eslint-disable no-undef */
describe('Test Suite for users db model', () => {
  beforeEach(async () => {
    await clearUsers();
    await insertSeedUsers(existingUser);
  });
  it('should add new user to db', async () => {
    const newUser = await users.add({ ...userMatthew });
    expect(newUser.email).to.equal(userMatthew.email);
  });

  it('should require email', async () => {
    const result = await users.add({ ...userJane, email: '   ' });
    expect(result.err.message).to.equal('Email is required');
  });

  it('should require a valid email', async () => {
    const result = await users.add({ ...userJane, email: invalidUser.email });
    expect(result.err.message).to.equal('Email is invalid');
  });

  it('should require a unique email', async () => {
    const result = await users.add(existingUser);
    expect(result.err.message).to.equal('Email exists');
  });

  it('should require a username', async () => {
    const result = await users.add({ ...userJane, username: '  ' });
    expect(result.err.message).to.equal('Username is required');
  });

  it('should require a unique username', async () => {
    const result = await users.add({ ...userJane, username: existingUser.username });
    expect(result.err.message).to.equal('Username exists');
  });

  it('should require a password', async () => {
    const result = await users.add({ ...userMatthew, password: '  ' });
    expect(result.err.message).to.equal('Password is required');
  });

  it('should require a valid password', async () => {
    const result = await users.add({
      ...userMatthew, password: 'abc',
    });
    expect(result.err.message).to.equal('Password must have atleast 6 characters');
  });

  it('should store hash password after adding', async () => {
    const result = await users.add(userMatthew);
    expect(bcrypt.compareSync(userMatthew.password, result.password));
  });

  it('should update user password', async () => {
    const testUser = { ...existingUser };
    testUser.password = 'Newpassword';
    testUser.id = 1;
    const result = await users.update(testUser);
    expect(bcrypt.compareSync(testUser.password, result.password));
  });

  it('should get user by email', async () => {
    await users.add(userJane);
    const result = await users.getByEmail(userJane.email);
    expect(result.email).to.equal(userJane.email);
  });

  it('should get user by username', async () => {
    await users.add(userMatthew);
    const result = await users.getByUsername(userMatthew.username);
    expect(result.username).to.equal(userMatthew.username);
  });

  it('should get user by id', async () => {
    const result = await users.get(1);
    expect(result.email).to.equal(existingUser.email);
  });

  it('should delete user from db', async () => {
    await users.delete(1);
    const result = await users.getByEmail(existingUser.email);
    expect(result).to.equal(null);
  });

  it('should get all users in the db', async () => {
    await users.add(userJane);
    const result = await users.getAll();
    expect(result.length).to.equal(2);
  });

  it('should truncate users model in the db', async () => {
    await users.truncate();
    const result = await users.getAll();
    expect(result).to.equal(null);
  });
});
