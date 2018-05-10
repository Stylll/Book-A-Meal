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
    /**
     * This uses a promise all to run all validation.
     * It catches any invalid data and returns it.
     */
    return Promise.all([user.emailValid(request), user.usernameValid(request),
      user.passwordValid(request)], user.accountValid(request)).then(() => next())
      .catch(err => response.status(err.status).send({ message: err.message }));
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
    return Promise.all([user.emailValid(request, false),
      user.passwordValid(request, false)]).then(() => next())
      .catch(err => response.status(err.status).send({ message: err.message }));

    // user.emailValid(request, false);
    // validate password
    // user.passwordValid(request, false);
    // return next();
  }
}

export default validateUser;
