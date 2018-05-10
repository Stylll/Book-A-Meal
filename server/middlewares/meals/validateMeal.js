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
      return response.status(400).json({ message: 'Meal id is invalid' });
    }
    const result = await meals.get(parseInt(request.params.id, 10));
    if (!result) {
      return response.status(400).json({
        message: 'Meal does not exist',
      });
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
    if (!request.body.name || !request.body.name.trim()) {
      return response.status(400).json({
        message: 'Meal name is required',
      });
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
        return response.status(409).json({
          message: 'Meal name already exists',
        });
      }
      return next();
    }
    return response.status(400).json({
      message: 'Meal name is required',
    });
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
    if (!request.body.price) return response.status(400).json({ message: 'Price is required' });

    if (Number.isNaN(parseFloat(request.body.price, 10))) {
      return response.status(400).json({
        message: 'Price is invalid',
      });
    }

    if (/[^0-9.]/gi.test(request.body.price) === true) {
      return response.status(400).json({
        message: 'Price is invalid',
      });
    }

    if (request.body.price <= 1) return response.status(400).json({ message: 'Price must be greater than one' });

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
    if (request.decoded.user.accountType !== 'admin' &&
      request.decoded.user.id !== result.userId) {
      return response.status(403).json({ message: 'Unauthorized access' });
    }
    return next();
  }
}

export default ValidateMeal;
