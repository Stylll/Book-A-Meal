import meals from '../../db/meals';
import BaseValidator from './baseValidator';

/**
 * Meal Middleware validators
 */

class meal extends BaseValidator {
  /**
   * static method to check if a meal id exists
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static idExists(request) {
    if (!meals.get(parseInt(request.params.id, 10))) {
      this.throwError('Meal does not exist', 400);
    }
  }
  /**
   * static method to check if the meal name is provided
   * throws an error if name is not provided
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static validateName(request) {
    if (!request.body.name || !request.body.name.trim()) {
      this.throwError('Meal name is required', 400);
    }
  }

  /**
   * static method to validate that a meal name exists
   * throws an error if name exists
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static nameExists(request) {
    if (request.body.name && meals.getByName(request.body.name.trim())) {
      this.throwError('Meal name already exists', 409);
    }
  }

  /**
   * static method.
   * check if price is provided.
   * if price is valid.
   * if price is greater than 1.
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static priceValid(request) {
    if (!request.body.price) this.throwError('Price is required', 400);

    if (/[^0-9.]/gi.test(request.body.price) === true) {
      this.throwError('Price is invalid', 400);
    }

    if (request.body.price <= 1) this.throwError('Price must be greater than one', 400);
  }

  /**
   * static method to validate CRUD access
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static validateAccess(request) {
    // check if user is admin or the creator of the meal
    if (request.decoded.user.accountType !== 'admin' &&
        request.decoded.user.id !== meals.get(parseInt(request.params.id, 10)).userId) {
      this.throwError('Unauthorized access', 403);
    }
  }
}

export default meal;
