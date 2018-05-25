const validCaterer = {
  id: 1,
  username: 'stephen',
  email: 'stephen@yahoo.com',
  password: '12345678',
  accountType: 'caterer',
};

const validCustomer = {
  id: 1,
  username: 'stephen',
  email: 'stephen@yahoo.com',
  password: '12345678',
  accountType: 'customer',
};

const signupError = {
  email: 'Email is required',
  username: 'Username is required',
};

const signupSuccessResponse = {
  message: 'Signup successful',
  user: {
    id: 1,
    email: 'jamiefox@yahoo.com',
    username: 'jamie',
    accountType: 'customer',
  },
  token: 'skkeei223.saoqwoi11.wwowdr',
};

const signupFailedResponse = {
  errors: {
    email: {
      message: 'Email is required',
      statusCode: 400,
    },
    username: {
      message: 'Username is required',
      statusCode: 400,
    },
  },
};

export {
  validCaterer,
  validCustomer,
  signupError,
  signupSuccessResponse,
  signupFailedResponse,
};