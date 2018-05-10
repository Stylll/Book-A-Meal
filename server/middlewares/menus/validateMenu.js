import menus from '../../db/menus';
import meals from '../../db/meals';

/**
 * Menu Middleware validators
 */

class ValidateMenu {
  /**
   * static method to check if a menu id exists
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object | function} Error message and status code | next function
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
   * @param {object} response
   * @param {function} next
   * @returns {object | function} Error message and status code | next function
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
   * @param {object} response
   * @param {function} next
   * @returns {object | function} Error message and status code | next function
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
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object | function} Error message and status code | next function
   */
  static mealsValid(request, response, next) {
    if (!request.body.mealIds) {
      return response.status(400).json({ message: 'Array of meal ids is required' });
    }

    if (!Array.isArray(request.body.mealIds)) {
      return response.status(400).json({ message: 'Meal ids must be in an array' });
    }

    /* eslint-disable consistent-return */
    request.body.mealIds.forEach((id) => {
      if (!Number.isInteger(id)) {
        return response.status(400).json({ message: 'One or more meal ids are invalid' });
      }
    });

    return next();
  }

  /**
   * static method to check if meals exists in the db
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object | function} Error message and status code | next function
   */
  static async mealExists(request, response, next) {
    /* eslint-disable no-plusplus */
    for (let i = 0; i < request.body.mealIds.length; i++) {
      /* eslint-disable no-await-in-loop */
      const result = await meals.get(request.body.mealIds[i]);
      if (!result) {
        return response.status(400).json({ message: 'One or more meals don\'t exist in the database' });
      }
    }
    return next();
  }

  /**
   * static method to check the user is the owner of a meal
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object | function} Error message and status code | next function
   */
  /* eslint-disable consistent-return */
  static async validateMealOwner(request, response, next) {
    const { decoded } = request;
    if (decoded.user.accountType !== 'admin') {
      /* eslint-disable no-plusplus */
      for (let i = 0; i < request.body.mealIds.length; i++) {
        /* eslint-disable no-await-in-loop */
        const result = await meals.get(request.body.mealIds[i]);
        if (result && decoded.user.id !== result.userId) {
          return response.status(403).json({ message: 'Cannot add another caterers meal' });
        }
      }
      return next();
    }

    return next();
  }
}

export default ValidateMenu;
