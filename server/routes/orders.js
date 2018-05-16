import OrderController from '../controllers/OrderController';
import validateAccount from '../middlewares/users/validateAccount';
import validateOrder from '../middlewares/orders/validateOrder';
import ErrorHandler from '../middlewares/ErrorHandler';

/**
 * Router to handle order requests
 * @param {object} router router object from express
 * @returns {object} orders router object
 */

const orders = (router) => {
  /**
   * order router to handle post requests
   */
  router.post(
    '/orders', validateAccount.user, validateAccount.customer, validateOrder.isOpen,
    validateOrder.mealValid, validateOrder.mealInMenu, validateOrder.quantityValid,
    ErrorHandler.handleErrors, OrderController.post,
  );

  /**
   * order router to handle put requests
   */
  router.put(
    '/orders/:id', validateAccount.user, validateOrder.orderValid, validateOrder.mealValidIfPassed,
    validateOrder.mealInMenuIfPassed, validateOrder.quantityValidIfPassed,
    validateOrder.statusValid, validateOrder.validateCustomerAccess,
    validateOrder.validateSuperAccess, ErrorHandler.handleErrors,
    OrderController.put,
  );

  /**
   * order router to handle get requests
   */
  router.get('/orders', validateAccount.user, OrderController.get);
};

export default orders;
