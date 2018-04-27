import OrderController from '../controllers/OrderController';
import validateOrder from '../middlewares/orders/validateOrder';
import validateAccount from '../middlewares/users/validateAccount';

/**
 * Router to handle order requests
 * @param {*} router router object from express
 * @returns {} response object
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
};

export default orders;
