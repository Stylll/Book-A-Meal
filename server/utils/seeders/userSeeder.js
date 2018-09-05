import randomstring from 'randomstring';
import users from '../../db/users';

/**
 * template data store for users
 */

const userMatthew = {
  email: 'matthew@yahoo.com',
  username: 'Matthew',
  password: 'Mat1234',
  accountType: 'customer',
};

const userJane = {
  email: 'jane@yahoo.com',
  username: 'jane',
  password: 'janneeh',
  accountType: 'caterer',
};

const existingUser = {
  email: 'higgin@yahoo.com',
  username: 'higgin',
  password: 'higgineee',
  accountType: 'caterer',
  resetPasswordToken: randomstring.generate(30),
  resetPasswordExpires: Date.now() + 360000,
};

const userStephen = {
  email: 'stephen.aribaba@gmail.com',
  username: 'Stephen',
  password: 'stephen',
  accountType: 'admin',
};

const invalidUser = {
  email: 'myemail',
  username: '',
  password: 'abc',
  accountType: 'supervisor',
};

/**
 * inserts seed users into database for testing
 * @param {object} user
 */
const insertSeedUsers = async (user) => {
  await users.add(user);
};

/**
 * truncates the data in users table
 */
const clearUsers = async () => {
  await users.truncate();
};

export {
  userMatthew,
  userJane,
  existingUser,
  invalidUser,
  userStephen,
  insertSeedUsers,
  clearUsers,
};
