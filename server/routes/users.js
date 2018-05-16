import UserController from '../controllers/UserController';
import validateUser from '../middlewares/users/validateUser';
import ErrorHandler from '../middlewares/ErrorHandler';

/**
 * Router to handle user requests
 * @param {object} router router object from express
 * @returns {object} users router object
 */

const users = (router) => {
  router.post(
    '/users/signup', validateUser.emailValid, validateUser.usernameValid,
    validateUser.passwordValid, validateUser.accountValid, ErrorHandler.handleErrors,
    UserController.signup,
  );

  router.post(
    '/users/signin', validateUser.emailLoginValid, validateUser.passwordLoginValid,
    ErrorHandler.handleErrors, UserController.signin,
  );
};

export default users;
