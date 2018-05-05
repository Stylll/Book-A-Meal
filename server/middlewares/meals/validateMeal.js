import meal from '../../utils/validators/vMeal';

/**
 * Middleware class to validate Meal
 */
/* eslint-disable no-plusplus */
class ValidateMeal {
  /**
   * Static method to validate meal post request
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @throws {object} Error message and status code
   * @returns {function} next
   */
  static post(request, response, next) {
    // validate meal name is provided
    meal.validateName(request);
    // validate meal name is unique
    meal.nameExists(request);
    // validate price is valid
    meal.priceValid(request);

    return next();
  }

  /**
   * Static method to validate meal put requests
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @throws {object} Error message and status code
   * @returns {function} next
   */
  static put(request, response, next) {
    // check if id exists already
    meal.idExists(request);
    // check if meal name exists
    meal.nameExists(request);
    // check if price is valid if provided
    if (request.body.price) meal.priceValid(request);
    // validate crud access
    meal.validateAccess(request);

    return next();
  }

  /**
   * Static method to validate meal delete requests
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @throws {object} Error message and status code
   * @returns {function} next
   */
  static delete(request, response, next) {
    // check if meal exists
    meal.idExists(request);
    // check if user is admin or the creator of the meal
    meal.validateAccess(request);
    return next();
  }
}

export default ValidateMeal;
