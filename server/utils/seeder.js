
const validUser1 = {
  email: 'matthew@yahoo.com',
  username: 'Matthew',
  password: 'Mat123',
  accountType: 'customer',
};

const validUser2 = {
  email: 'jane@yahoo.com',
  username: 'jane',
  password: 'jannee',
  accountType: 'caterer',
};

const existingUser = {
  email: 'higgin@yahoo.com',
  username: 'higgin',
  password: 'higgineee',
  accountType: 'caterer',
};

const invalidUser = {
  email: 'myemail',
  username: '',
  password: '',
  accountType: 'supervisor',
};

/**
 * inserts seed users into database for testing
 */
const insertSeedUsers = () => {
  
};

export {
  validUser1,
  validUser2,
  existingUser,
  invalidUser,
  insertSeedUsers,
};
