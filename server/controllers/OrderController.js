import orders from '../db/orders';
import meals from '../db/meals';
import OrderUtils from '../utils/orders/orderUtils';

class OrderController {
  /**
   * Static method to handle order post request
   * @param {object} request
   * @param {object} response
   * @returns {object} {order, message} | {message}
   */
  static post(request, response) {
    // get price from meal object
    const meal = meals.get(parseInt(request.body.mealId, 10));

    // create order object
    const order = {
      mealId: parseInt(request.body.mealId, 10),
      price: meal.price,
      quantity: parseInt(request.body.quantity, 10),
      userId: request.decoded.user.id,
    };

    // save the order object
    const newOrder = orders.add(order);

    if (newOrder && !newOrder.err) {
      return response.status(201).send({ order: newOrder, message: 'Created successfully' });
    }
    return response.status(500).send({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle order put requests
   * @param {object} request
   * @param {object} response
   * @returns {object} {order, message} | {message}
   */
  static put(request, response) {
    // get order object
    const order = { ...orders.get(parseInt(request.params.id, 10)) };

    // if order exists
    if (order && !order.err) {
      // update order, save order and return new order
      order.mealId = (request.body.mealId) ? parseInt(request.body.mealId, 10) : order.mealId;
      order.quantity = (request.body.quantity)
        ? parseInt(request.body.quantity, 10) : order.quantity;
      order.price = (request.body.mealId) ? meals.get(parseInt(request.body.mealId, 10)).price
        : order.price;
      order.status = request.body.status || order.status;

      const newOrder = orders.update(order);

      return response.status(200).send({ order: newOrder, message: 'Updated successfully' });
    }
    return response.status(500).send({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle order get requests
   * @param {object} request
   * @param {object} response
   * @returns {object} {orders} | {message}
   */
  static get(request, response) {
    if (request.decoded.user.accountType === 'admin') {
      /**
       * get all orders from the db
       * pass it through the builder to attach meal and user objects
       * return the order array
       */
      const orderArray = OrderUtils.buildOrders(orders.getAll());
      return response.status(200).send({ orders: orderArray });
    }
    if (request.decoded.user.accountType === 'caterer') {
      /**
       * get all orders from the db where meal was created by the caterer
       * pass it through the builder to attach meal and user objects
       * return the order array
       */
      const orderArray = OrderUtils.buildOrders(orders.getByCatererId(request.decoded.user.id));
      return response.status(200).send({ orders: orderArray });
    }
    if (request.decoded.user.accountType === 'customer') {
      /**
       * get orders by user id from the db
       * pass it through the builder to attach meal and user objects
       * return the order array
       */
      const orderArray = OrderUtils.buildOrders(orders.getByUserId(request.decoded.user.id));
      return response.status(200).send({ orders: orderArray });
    }
    return response.status(500).send({ message: 'Internal Server Error' });
  }
}

export default OrderController;
