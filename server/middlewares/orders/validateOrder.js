import order from '../../utils/validators/vOrder';

/**
 * Middleware class to validate Meal
 */

class ValidateOrder {
  /**
   * Static method to validate orders post requests
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @throws {object} Error message and status code
   * @returns {function} next
   */
  static post(request, response, next) {
    // validate meal option
    order.mealValid(request);
    // check if meal exists in the menu
    order.mealInMenu(request);
    // check if quantity is valid
    order.quantityValid(request);

    // return next if no error
    return next();
  }

  /**
   * Static method to validate order put request
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @throws {object} Error message and status code
   * @returns {function} next
   */
  static put(request, response, next) {
    // check if order id is valid
    order.orderValid(request);
    // check if meal id is provided, valid and exists in the menu
    if (request.body.mealId) {
      order.mealValid(request);
      order.mealInMenu(request);
    }
    // check if quantity is provided and valid
    if (request.body.quantity) order.quantityValid(request);
    // validate status
    order.statusValid(request);
    // check user is a customer
    if (request.decoded.user.accountType === 'customer') {
      order.validateCustomerAccess(request);
      return next();
    }
    // validate admin and caterer
    order.validateSuperAccess(request);
    // call next function
    return next();
  }
}

export default ValidateOrder;
