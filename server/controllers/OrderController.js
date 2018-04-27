import orders from '../db/orders';

class OrderController {
  /**
   * Static method to handle order post request
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static post(req, res) {
    // create order object
    const order = {
      mealId: parseInt(req.body.mealId, 10),
      price: parseFloat(req.body.price, 10),
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

  static put(req, res) {
    // get order object
    const order = { ...orders.get(parseInt(req.params.id, 10)) };

    // if order exists
    if (order && !order.err) {
      // update order, save order and return new order
      order.status = req.body.status;

      const newOrder = orders.update(order);

      return newOrder;
    }
    return res.status(500).send({ message: 'Internal Server Error' });
  }
}

export default OrderController;
