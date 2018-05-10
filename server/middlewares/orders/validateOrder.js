import moment from 'moment';
import menus from '../../db/menus';
import meals from '../../db/meals';
import orders from '../../db/orders';

/**
 * Order Middleware validators
 */

class order {
  /**
   * static method to check if a meal id exists
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object} Error message and status code
   */
  static async mealValid(request, response, next) {
    if (!request.body.mealId) {
      return response.status(400).json({ message: 'Meal id is required' });
    }
    if (!Number.isInteger(parseInt(request.body.mealId, 10))) {
      return response.status(400).json({ message: 'Meal id is invalid' });
    }
    const meal = await meals.get(parseInt(request.body.mealId, 10));
    if (!meal) {
      return response.status(400).json({ message: 'Meal does not exist' });
    }
    return next();
  }

  /**
   * static method to check if a meal id exists if its passed
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object} Error message and status code
   */
  static async mealValidIfPassed(request, response, next) {
    if (!request.body.mealId) {
      return next();
    }
    if (!Number.isInteger(parseInt(request.body.mealId, 10))) {
      return response.status(400).json({ message: 'Meal id is invalid' });
    }
    const meal = await meals.get(parseInt(request.body.mealId, 10));
    if (!meal) {
      return response.status(400).json({ message: 'Meal does not exist' });
    }
    return next();
  }

  /**
   * Static method to check if the shop is opened
   * Opening time is between 7:00AM and 5:00PM
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object} Error message and status code
   */
  static isOpen(request, response, next) {
    const currentHour = moment.duration(new Date().getTime()).hours();
    if (currentHour > 17 || currentHour < 7) {
      return response.status(200).json({ message: 'Sorry. We are closed for the day. Please come back between 7:00AM and 5:00PM.' });
    }
    return next();
  }

  /**
   * static method
   * checks if order id is valid
   * checks if order exists
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object} Error message and status code
   */
  static async orderValid(request, response, next) {
    // check if order id is valid
    if (!Number.isInteger(parseInt(request.params.id, 10))) {
      return response.status(400).json({ message: 'Order id is invalid' });
    }

    // check if order id exists
    const existingOrder = await orders.get(parseInt(request.params.id, 10));
    if (!existingOrder) {
      return response.status(400).json({ message: 'Order does not exist' });
    }
    return next();
  }

  /**
   * static method
   * check if menu is set
   * check if meal option is in the day's menu
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object} Error message and status code
   */
  static async mealInMenu(request, response, next) {
    const menu = await menus.getByDate(new Date());
    const mealId = parseInt(request.body.mealId, 10);

    if (!menu) response.status(400).json({ message: 'No menu is set' });

    if (!menu.mealIds.find(id => id === mealId)) {
      response.status(400).json({ message: 'Meal does not exist in menu' });
    }

    return next();
  }

  /**
   * static method
   * check if menu is set, then
   * check if meal option is in the day's menu
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object} Error message and status code
   */
  static async mealInMenuIfPassed(request, response, next) {
    if (!request.body.mealId) return next();
    const menu = await menus.getByDate(new Date());
    const mealId = parseInt(request.body.mealId, 10);

    if (!menu) response.status(400).json({ message: 'No menu is set' });

    if (!menu.mealIds.find(id => id === mealId)) {
      response.status(400).json({ message: 'Meal does not exist in menu' });
    }

    return next();
  }

  /**
   * static method
   * checks if quantity is passed
   * checks if quantity is valid
   * checks if quantity is above zero
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object} Error message and status code
   */
  static quantityValid(request, response, next) {
    // check if quantity is provided
    if (!request.body.quantity) {
      return response.status(400).json({ message: 'Quantity is required' });
    }

    if (!Number.isInteger(parseInt(request.body.quantity, 10))) {
      return response.status(400).json({ message: 'Quantity is invalid' });
    }

    // check if quantity is greater than 0
    if (parseInt(request.body.quantity, 10) <= 0) {
      return response.status(400).json({ message: 'Quantity should be greater than zero' });
    }
    return next();
  }

  /**
   * static method
   * checks if quantity is passed, then
   * checks if quantity is valid
   * checks if quantity is above zero
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object} Error message and status code
   */
  static quantityValidIfPassed(request, response, next) {
    // check if quantity is provided
    if (!request.body.quantity) {
      return next();
    }

    if (!Number.isInteger(parseInt(request.body.quantity, 10))) {
      return response.status(400).json({ message: 'Quantity is invalid' });
    }

    // check if quantity is greater than 0
    if (parseInt(request.body.quantity, 10) <= 0) {
      return response.status(400).json({ message: 'Quantity should be greater than zero' });
    }
    return next();
  }

  /**
   * static method
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object} Error message and status code
   */
  static async statusValid(request, response, next) {
    // get order object
    const existingOrder = await orders.get(parseInt(request.params.id, 10));

    // check if order status is provided
    if (!request.body.status) {
      return response.status(400).json({ message: 'Status is required' });
    }

    // check if order status is valid
    if (!(request.body.status === 'pending') && !(request.body.status === 'complete') && !(request.body.status === 'canceled')) {
      return response.status(400).json({ message: 'Status is invalid' });
    }

    // check if order status from db is not pending
    if (existingOrder.status !== 'pending') {
      return response.status(403).json({ message: 'Cannot change status' });
    }

    return next();
  }

  /**
   * static method
   * validates that only customers are allowed to change meal option and quantity
   * validates that only a caterer who's meal is in the order can make changes
   * validates that the admin can make changes whether he created the meal or not
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object} Error message and status code
   */
  static async validateSuperAccess(request, response, next) {
    if (request.decoded.user.accountType === 'customer') return next();

    const existingOrder = await orders.get(parseInt(request.params.id, 10));

    // get meal id, either from request body or order db object
    const mId = request.body.mealId || existingOrder.mealId;
    const meal = await meals.get(parseInt(mId, 10));

    // check if user is not an admin and not the owner of the meal id present in the order
    if (request.decoded.user.accountType !== 'admin' &&
        request.decoded.user.id !== meal.userId) {
      return response.status(403).json({ message: 'Unauthorized access' });
    }

    // confirm that only customers are allowed to update meal option and price
    if (request.body.mealId || request.body.quantity) {
      return response.status(403).json({ message: 'Only customers are allowed to change meal option or quantity' });
    }

    return next();
  }

  /**
   * static method
   * validates that the customer is the owner of the order
   * preventes customer from changing status to canceled or pending
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {object} Error message and status code
   */
  static async validateCustomerAccess(request, response, next) {
    /**
     * Uses this validation if user is a customer.
     * Else, it calls the next middleware.
     */
    if (request.decoded.user.accountType === 'customer') {
      const existingOrder = await orders.get(parseInt(request.params.id, 10));
      // check if customer is the owner of the order
      if (existingOrder.userId !== request.decoded.user.id) {
        return response.status(403).json({ message: 'Unauthorized access' });
      }

      // check if customer order status is complete
      if (request.body.status === 'complete') {
        return response.status(403).json({ message: 'Can only update status with canceled or pending' });
      }
      return next();
    }
    return next();
  }
}

export default order;
