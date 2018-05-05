import menu from '../../utils/validators/vMenu';
/**
 * Middleware class to validate Meal
 */
class ValidateMenu {
  /**
   * static middleware method to validate menu post requests
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @throws {object} Error message and status code
   * @returns {function} next
   */
  static post(request, response, next) {
    // check if date already exists
    menu.existsForDay();
    // check if meal id array is provided and valid
    menu.mealsValid(request);

    return next();
  }

  /**
   * static middleware method to validate menu put requests
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @throws {object} Error message and status code
   * @returns {function} next
   */
  static put(request, response, next) {
    // check if menu id is valid
    menu.menuValid(request);
    // check if menu id exists
    menu.idExists(request);
    // check if meal id array is provided and valid
    menu.mealsValid(request);

    return next();
  }
}

export default ValidateMenu;
