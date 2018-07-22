import OrderController from '../controllers/OrderController';
import validateAccount from '../middlewares/users/validateAccount';
import validateOrder from '../middlewares/orders/validateOrder';
import ErrorHandler from '../middlewares/ErrorHandler';
import AsyncWrapper from '../utils/AsyncWrapper';

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
    ErrorHandler.handleErrors, AsyncWrapper(OrderController.post),
  );

  /**
   * order router to handle put requests
   */
  router.put(
    '/orders/:id', validateAccount.user, validateOrder.orderValid, validateOrder.mealValidIfPassed,
    validateOrder.mealInMenuIfPassed, validateOrder.quantityValidIfPassed,
    validateOrder.statusValid, validateOrder.validateCustomerAccess,
    validateOrder.validateSuperAccess, ErrorHandler.handleErrors,
    AsyncWrapper(OrderController.put),
  );

  /**
   * order router to handle get requests
   */
  router.get('/orders', validateAccount.user, AsyncWrapper(OrderController.get));

  /**
   * order router to handle order summary requests
   */
  router.get('/orders/summary', validateAccount.user, validateAccount.caterer, AsyncWrapper(OrderController.summary));
};

export default orders;
