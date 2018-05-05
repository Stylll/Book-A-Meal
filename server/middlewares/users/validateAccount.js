import account from '../../utils/validators/vAccount';
/**
 * Middleware Class to validate user account.
 * Validates general user
 * Validates caterer
 * Validates customer
 *
 */

class ValidateAccount {
  /**
   * static method to verify and authenticate user
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @throws {object} Error message and status code
   * @returns {function} next
   */
  static user(request, response, next) {
    // validate user
    account.tokenValid(request);
    return next();
  }

  /**
   * static method to verify if a user is a caterer or an admin
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @throws {object} Error message and status code
   * @returns {function} next
   */
  static caterer(request, response, next) {
    // validate caterer / admin account
    account.catererAdminValid(request);
    return next();
  }

  /**
   * static method to verify if a user is a customer
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @throws {object} Error message and status code
   * @returns {function} next
   */
  static customer(request, response, next) {
    account.customerValid(request);
    return next();
  }
}

export default ValidateAccount;
