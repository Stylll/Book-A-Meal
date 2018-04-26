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
      menuId: parseInt(req.body.menuId, 10),
      price: req.body.price,
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
}

export default OrderController;
