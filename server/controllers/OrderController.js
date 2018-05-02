import orders from '../db/orders';
import meals from '../db/meals';
import OrderUtils from '../utils/orders/orderUtils';

class OrderController {
  /**
   * Static method to handle order post request
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static post(req, res) {
    // get price from meal object
    const meal = meals.get(parseInt(req.body.mealId, 10));

    // create order object
    const order = {
      mealId: parseInt(req.body.mealId, 10),
      price: meal.price,
      quantity: parseInt(req.body.quantity, 10),
      userId: req.decoded.user.id,
    };

    // save the order object
    const newOrder = orders.add(order);

    if (newOrder && !newOrder.err) {
      return res.status(201).send({ order: newOrder });
    }
    return res.status(500).send({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle order put requests
   * @param {*} req
   * @param {*} res
   */
  static put(req, res) {
    // get order object
    const order = { ...orders.get(parseInt(req.params.id, 10)) };

    // if order exists
    if (order && !order.err) {
      // update order, save order and return new order
      order.mealId = (req.body.mealId) ? parseInt(req.body.mealId, 10) : order.mealId;
      order.quantity = (req.body.quantity) ? parseInt(req.body.quantity, 10) : order.quantity;
      order.price = (req.body.mealId) ? meals.get(parseInt(req.body.mealId, 10)).price
        : order.price;
      order.status = req.body.status || order.status;

      const newOrder = orders.update(order);

      return res.status(200).send({ order: newOrder });
    }
    return res.status(500).send({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle order get requests
   * @param {*} req
   * @param {*} res
   */
  static get(req, res) {
    if (req.decoded.user.accountType === 'admin') {
      /**
       * get all orders from the db
       * pass it through the builder to attach meal and user objects
       * return the order array
       */
      const orderArray = OrderUtils.buildOrders(orders.getAll());
      return res.status(200).send({ orders: orderArray });
    }
    if (req.decoded.user.accountType === 'caterer') {
      /**
       * get all orders from the db where meal was created by the caterer
       * pass it through the builder to attach meal and user objects
       * return the order array
       */
      const orderArray = OrderUtils.buildOrders(orders.getByCatererId(req.decoded.user.id));
      return res.status(200).send({ orders: orderArray });
    }
    if (req.decoded.user.accountType === 'customer') {
      /**
       * get orders by user id from the db
       * pass it through the builder to attach meal and user objects
       * return the order array
       */
      const orderArray = OrderUtils.buildOrders(orders.getByUserId(req.decoded.user.id));
      return res.status(200).send({ orders: orderArray });
    }
    return res.status(500).send({ message: 'Internal Server Error' });
  }
}

export default OrderController;
