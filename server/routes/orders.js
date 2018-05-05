import OrderController from '../controllers/OrderController';
import validateOrder from '../middlewares/orders/validateOrder';
import validateAccount from '../middlewares/users/validateAccount';

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
    '/orders', validateAccount.user, validateAccount.customer,
    validateOrder.post, OrderController.post,
  );

  /**
   * order router to handle put requests
   */
  router.put(
    '/orders/:id', validateAccount.user, validateOrder.put,
    OrderController.put,
  );

  /**
   * order router to handle get requests
   */
  router.get('/orders', validateAccount.user, OrderController.get);
};

export default orders;
