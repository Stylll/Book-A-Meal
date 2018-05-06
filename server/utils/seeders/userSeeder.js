import users from '../../db/users';

/**
 * template data store for users
 */

const validUser1 = {
  email: 'matthew@yahoo.com',
  username: 'Matthew',
  password: 'Mat1234',
  accountType: 'customer',
};

const validUser2 = {
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
};

const adminUser = {
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
const insertSeedUsers = (user) => {
  users.add(user);
};

/**
 * truncates the data in users table
 */
const clearUsers = () => {
  users.truncate();
};

export {
  validUser1,
  validUser2,
  existingUser,
  invalidUser,
  adminUser,
  insertSeedUsers,
  clearUsers,
};
