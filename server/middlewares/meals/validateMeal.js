import meals from '../../db/meals';

/**
 * Meal Middleware validators
 */

class ValidateMeal {
  /**
   * static method to check if a meal id exists
   * @param {object} request
   * @returns {object} Error message and status code
   */
  static async idExists(request, response, next) {
    if (!Number.isInteger(parseInt(request.params.id, 10))) {
      request.errors.id = {
        message: 'Meal id is invalid',
        statusCode: 400,
      };
      return next();
    }
    const result = await meals.get(parseInt(request.params.id, 10));
    if (!result) {
      request.errors.id = {
        message: 'Meal does not exist',
        statusCode: 400,
      };
      return next();
    }

    return next();
  }
  /**
   * static method to check if the meal name is provided
   * throws an error if name is not provided
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static validateName(request, response, next) {
    if (!(request.body.name && request.body.name.trim().length > 0)) {
      request.errors.name = {
        message: 'Meal name is required',
        statusCode: 400,
      };
      return next();
    }
    return next();
  }

  /**
   * static method to validate that a meal name exists
   * throws an error if name exists
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static async nameExists(request, response, next) {
    if (request.body.name) {
      const result = await meals.getByName(request.body.name.trim());
      if (result && result.id !== parseInt(request.params.id, 10)) {
        request.errors.name = {
          message: 'Meal name already exists',
          statusCode: 409,
        };
        return next();
      }
      return next();
    }
    request.errors.name = {
      message: 'Meal name is required',
      statusCode: 400,
    };
    return next();
  }

  /**
   * static method.
   * check if price is provided.
   * if price is valid.
   * if price is greater than 1.
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static priceValid(request, response, next) {
    if (!request.body.price) {
      request.errors.price = {
        message: 'Price is required',
        statusCode: 400,
      };
      return next();
    }

    if (Number.isNaN(parseFloat(request.body.price, 10))) {
      request.errors.price = {
        message: 'Price is invalid',
        statusCode: 400,
      };
      return next();
    }

    if (/[^0-9.]/gi.test(request.body.price) === true) {
      request.errors.price = {
        message: 'Price is invalid',
        statusCode: 400,
      };
      return next();
    }

    if (request.body.price <= 1) {
      request.errors.price = {
        message: 'Price must be greater than one',
        statusCode: 400,
      };
      return next();
    }

    return next();
  }

  /**
   * static method to validate CRUD access
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static async validateAccess(request, response, next) {
    // check if user is admin or the creator of the meal
    const result = await meals.get(parseInt(request.params.id, 10));
    if (!result || (request.decoded.user.accountType !== 'admin' &&
      request.decoded.user.id !== result.userId)) {
      request.errors.access = {
        message: 'Unauthorized access',
        statusCode: 403,
      };
      return next();
    }
    return next();
  }
}

export default ValidateMeal;
