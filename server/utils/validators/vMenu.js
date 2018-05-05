import menus from '../../db/menus';
import BaseValidator from './baseValidator';

/**
 * Menu Middleware validators
 */

class menu extends BaseValidator {
  /**
   * static method to check if a menu id exists
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static idExists(request) {
    if (!menus.get(parseInt(request.params.id, 10))) {
      this.throwError('Menu does not exist', 400);
    }
  }

  /**
   * static method to check if the menu id is valid
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static menuValid(request) {
    if (!Number.isInteger(parseInt(request.params.id, 10))) {
      this.throwError('Menu id is invalid', 400);
    }
  }

  /**
   * static method to check if menu for the day already exists
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static existsForDay() {
    if (menus.getByDate(new Date())) {
      this.throwError('Menu for the day already exists', 409);
    }
  }

  /**
   * static method to check if meal options are valid
   * @param {*} request
   * @throws {object} Error message and status code
   */
  static mealsValid(request) {
    if (!request.body.mealIds) {
      this.throwError('Array of meal ids is required', 400);
    }

    if (!Array.isArray(request.body.mealIds)) {
      this.throwError('Meal ids must be in an array', 400);
    }
  }
}

export default menu;
