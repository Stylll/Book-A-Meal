import UserController from '../controllers/UserController';
import validateUser from '../middlewares/users/validateUser';
import ErrorHandler from '../middlewares/ErrorHandler';
import AsyncWrapper from '../utils/AsyncWrapper';

/**
 * Router to handle user requests
 * @param {object} router router object from express
 * @returns {object} users router object
 */

const users = (router) => {
  router.post(
    '/users/signup', validateUser.emailValid, validateUser.usernameValid,
    validateUser.passwordValid, validateUser.accountValid,
    ErrorHandler.handleErrors, AsyncWrapper(UserController.signup),
  );

  router.post(
    '/users/signin', validateUser.emailLoginValid,
    validateUser.passwordLoginValid, ErrorHandler.handleErrors,
    AsyncWrapper(UserController.signin),
  );

  router.put(
    '/users/forgotpassword', validateUser.forgotPasswordValid,
    ErrorHandler.handleErrors, AsyncWrapper(UserController.forgotpassword),
  );

  router.put(
    '/users/resetpassword/:token', validateUser.passwordValid,
    ErrorHandler.handleErrors, AsyncWrapper(UserController.resetpassword),
  );
};

export default users;
