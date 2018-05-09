import menus from '../../db/menus';
import meals from '../../db/meals';

/**
 * Menu Middleware validators
 */

class ValidateMenu {
  /**
   * static method to check if a menu id exists
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static async idExists(request, response, next) {
    const result = await menus.get(parseInt(request.params.id, 10));
    if (!result) {
      return response.status(400).json({ message: 'Menu does not exist' });
    }
    return next();
  }

  /**
   * static method to check if the menu id is valid
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static menuValid(request, response, next) {
    if (!Number.isInteger(parseInt(request.params.id, 10))) {
      return response.status(400).json({ message: 'Menu id is invalid' });
    }
    return next();
  }

  /**
   * static method to check if menu for the day already exists
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static async existsForDay(request, response, next) {
    const result = await menus.getByDate(new Date());
    if (result) {
      return response.status(409).json({ message: 'Menu for the day already exists' });
    }
    return next();
  }

  /**
   * static method to check if meal options are valid
   * @param {*} request
   * @throws {object} Error message and status code
   */
  static mealsValid(request, response, next) {
    if (!request.body.mealIds) {
      return response.status(400).json({ message: 'Array of meal ids is required' });
    }

    if (!Array.isArray(request.body.mealIds)) {
      return response.status(400).json({ message: 'Meal ids must be in an array' });
    }
    return next();
  }

  static async validateMealOwner(request, response, next) {
    const { decoded } = request;
    if (decoded.user.accountType !== 'admin') {
      request.body.mealIds.forEach(async (id) => {
        const result = await meals.get(id);
        if (result && decoded.user.id !== result.userId) {
          return response.status(403).json({ message: 'Cannot add another caterers meal' });
        }
      });
      return next();
    }

    return next();
  }
}

export default ValidateMenu;
