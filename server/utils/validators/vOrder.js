import menus from '../../db/menus';
import meals from '../../db/meals';
import orders from '../../db/orders';
import BaseValidator from './baseValidator';

/**
 * Order Middleware validators
 */

class order extends BaseValidator {
  /**
   * static method to check if an order id exists
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static mealValid(request) {
    if (!request.body.mealId) {
      this.throwError('Meal id is required', 400);
    }
    if (!Number.isInteger(parseInt(request.body.mealId, 10))) {
      this.throwError('Meal id is invalid', 400);
    }
    if (!meals.get(parseInt(request.body.mealId, 10))) {
      this.throwError('Meal does not exist', 400);
    }
  }

  /**
   * static method
   * checks if order id is valid
   * checks if order exists
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static orderValid(request) {
    // check if order id is valid
    if (!Number.isInteger(parseInt(request.params.id, 10))) this.throwError('Order id is invalid', 400);

    // check if order id exists
    if (!orders.get(parseInt(request.params.id, 10))) {
      this.throwError('Order does not exist', 400);
    }
  }

  /**
   * static method
   * check if menu is set
   * check if meal option is in the day's menu
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static mealInMenu(request) {
    const menu = menus.getByDate(new Date());
    const mealId = parseInt(request.body.mealId, 10);

    if (!menu) this.throwError('No menu is set', 400);

    if (!menu.mealIds.find(id => id === mealId)) this.throwError('Meal does not exist in menu', 400);
  }

  /**
   * static method
   * checks if quantity is passed
   * checks if quantity is valid
   * checks if quantity is above zero
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static quantityValid(request) {
    // check if quantity is provided
    if (!request.body.quantity) this.throwError('Quantity is required', 400);

    if (!Number.isInteger(parseInt(request.body.quantity, 10))) {
      this.throwError('Quantity is invalid', 400);
    }

    // check if quantity is greater than 0
    if (parseInt(request.body.quantity, 10) <= 0) this.throwError('Quantity should be greater than zero', 400);
  }

  /**
   * static method
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static statusValid(request) {
    // get order object
    const existingOrder = orders.get(parseInt(request.params.id, 10));

    // check if order status is provided
    if (!request.body.status) this.throwError('Status is required', 400);

    // check if order status is valid
    if (!(request.body.status === 'pending') && !(request.body.status === 'complete') && !(request.body.status === 'canceled')) {
      this.throwError('Status is invalid', 400);
    }

    // check if order status from db is not pending
    if (existingOrder.status !== 'pending') {
      this.throwError('Cannot change status', 403);
    }
  }

  /**
   * static method
   * validates that only customers are allowed to change meal option and quantity
   * validates that only a caterer who's meal is in the order can make changes
   * validates that the admin can make changes whether he created the meal or not
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static validateSuperAccess(request) {
    const existingOrder = orders.get(parseInt(request.params.id, 10));

    // confirm that only customers are allowed to update meal option and price
    if (request.body.mealId || request.body.quantity) {
      this.throwError('Only customers are allowed to change meal option or quantity', 403);
    }

    // get meal id, either from request body or order db object
    const mId = request.body.mealId || existingOrder.mealId;

    // check if user is not an admin and not the owner of the meal id present in the order
    if (request.decoded.user.accountType !== 'admin' &&
        request.decoded.user.id !== meals.get(parseInt(mId, 10)).userId) {
      this.throwError('Unauthorized access', 403);
    }
  }

  /**
   * static method
   * validates that the customer is the owner of the order
   * preventes customer from changing status to canceled or pending
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static validateCustomerAccess(request) {
    const existingOrder = orders.get(parseInt(request.params.id, 10));
    // check if customer is the owner of the order
    if (existingOrder.userId !== request.decoded.user.id) {
      this.throwError('Unauthorized Access', 403);
    }

    // check if customer order status is complete
    if (request.body.status === 'complete') {
      this.throwError('Can only update status with canceled or pending', 403);
    }
  }
}

export default order;
