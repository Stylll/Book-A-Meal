const emptyUser = {
  id: 1,
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  accountType: '',
};

const invalidUser = {
  id: 1,
  username: 'we&%^',
  email: 'stephen',
  password: '123',
  confirmPassword: '',
  accountType: '',
};

const validUser = {
  id: 1,
  username: 'stephen',
  email: 'stephen@yahoo.com',
  password: '12345678',
  confirmPassword: '12345678',
  accountType: 'customer',
};

const unmatchingUserPassword = {
  id: 1,
  username: 'stephen',
  email: 'stephen@yahoo.com',
  password: '12345678',
  confirmPassword: 'abcsdeirit',
  accountType: 'customer',
};

export {
  emptyUser,
  validUser,
  invalidUser,
  unmatchingUserPassword,
}