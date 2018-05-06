import user from '../../utils/validators/vUser';

/**
 * Middleware class to validate user actions
 */
class validateUser {
  /**
   * static method to validate a signup request body
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @throws {object} Error message and status code
   * @returns {function} next
   */
  static signup(request, response, next) {
    // validate email address
    user.emailValid(request);
    // validate username
    user.usernameValid(request);
    // validate password
    user.passwordValid(request);
    // validate account type
    user.accountValid(request);
    // all checks passes, then call the next function
    return next();
  }

  /**
   * static method to validate a signin request body
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @throws {object} Error message and status code
   * @returns {function} next
   */
  static signin(request, response, next) {
    // validate email
    user.emailValid(request, false);
    // validate password
    user.passwordValid(request, false);
    return next();
  }
}

export default validateUser;
