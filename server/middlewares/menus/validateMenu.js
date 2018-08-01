import { isEmpty } from 'lodash';
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
    if (!Number.isInteger(parseInt(request.params.id, 10))) {
      return next();
    }
    const result = await menus.get(parseInt(request.params.id, 10));
    if (!result) {
      request.errors.id = {
        message: 'Menu does not exist',
        statusCode: 400,
      };
      return next();
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
      request.errors.id = {
        message: 'Menu id is invalid',
        statusCode: 400,
      };
      return next();
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
    if (!isEmpty(result.menu)) {
      request.errors.menu = {
        message: 'Menu for the day already exists',
        statusCode: 409,
      };
      return next();
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
      request.errors.meals = {
        message: 'Array of meal ids is required',
        statusCode: 400,
      };
      return next();
    }

    if (!Array.isArray(request.body.mealIds)) {
      request.errors.meals = {
        message: 'Meal ids must be in an array',
        statusCode: 400,
      };
      return next();
    }

    /* eslint-disable consistent-return */
    request.body.mealIds.forEach((id) => {
      if (!Number.isInteger(id)) {
        request.errors.meals = {
          message: 'One or more meal ids are invalid',
          statusCode: 400,
        };
        return next();
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
    if (!request.body.mealIds) {
      return next();
    }
    /* eslint-disable no-plusplus */
    for (let i = 0; i < request.body.mealIds.length; i++) {
      /* eslint-disable no-await-in-loop */
      const result = await meals.get(request.body.mealIds[i]);
      if (!result) {
        request.errors.meals = {
          message: 'One or more meals don\'t exist in the database',
          statusCode: 400,
        };
        return next();
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
    if (!request.body.mealIds) {
      return next();
    }
    if (decoded.user.accountType !== 'admin') {
      /* eslint-disable no-plusplus */
      for (let i = 0; i < request.body.mealIds.length; i++) {
        /* eslint-disable no-await-in-loop */
        const result = await meals.get(request.body.mealIds[i]);
        if (result && decoded.user.id !== result.userId) {
          request.errors.access = {
            message: 'Cannot add another caterers meal',
            statusCode: 403,
          };
          return next();
        }
      }
      return next();
    }

    return next();
  }
}

export default ValidateMenu;
