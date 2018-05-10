import meals from '../../db/meals';

/**
 * Meal Middleware validators
 */

class meal {
  /**
   * static method to check if a meal id exists
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static async idExists(request) {
    try {
      const result = await meals.get(parseInt(request.params.id, 10));
      if (!result) {
        this.throwError('Meal does not exist', 400);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * static method to validate that a meal name exists
   * throws an error if name exists
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static async nameExists(request) {
    try {
      const result = await meals.getByName(request.body.name.trim());
      if (request.body.name && result) {
        this.throwError('Meal name already exists', 409);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * static method to validate CRUD access
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static async validateAccess(request) {
    // check if user is admin or the creator of the meal
    try {
      const result = await meals.get(parseInt(request.params.id, 10));
      if (request.decoded.user.accountType !== 'admin' &&
        request.decoded.user.id !== result.userId) {
        this.throwError('Unauthorized access', 403);
      }
    } catch (error) {
      throw error;
    }
  }
}

export default meal;

