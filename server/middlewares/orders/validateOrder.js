import meals from '../../db/meals';
import orders from '../../db/orders';

/**
 * Middleware class to validate Meal
 */

class ValidateOrder {
  /**
   * Static method to validate orders post requests
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static post(req, res, next) {
    // check if meal id is provided
    if (!req.body.mealId) return res.status(400).send({ message: 'Meal id is required' });

    // check if meal id is valid
    if (!Number.isInteger(parseInt(req.body.mealId, 10))) return res.status(400).send({ message: 'Meal id is invalid' });

    // check if meal id exists
    if (!meals.get(parseInt(req.body.mealId, 10))) return res.status(404).send({ message: 'Meal does not exist' });

    // check if price is provided
    if (!req.body.price) return res.status(400).send({ message: 'Price is required' });

    // check if price is a integer or float
    if (/[^0-9.]/gi.test(req.body.price) === true) {
      return res.status(400).send({ message: 'Price is invalid' });
    }

    // check if price is less than or equal to 1
    if (parseFloat(req.body.price, 10) <= 1) return res.status(400).send({ message: 'Price must be greater than one' });

    // check if quantity is valid
    if (!Number.isInteger(parseInt(req.body.quantity, 10))) {
      return res.status(400).send({ message: 'Quantity is invalid' });
    }

    // check if quantity is provided
    if (!parseInt(req.body.quantity, 10)) return res.status(400).send({ message: 'Quantity is required' });

    // check if user id is provided
    if (!req.decoded.user.id) return res.status(400).send({ message: 'User id is required' });

    // check if user id is valid
    if (!Number.isInteger(req.decoded.user.id)) return res.status(400).send({ message: 'User id is invalid' });

    // return next if no error
    return next();
  }

  /**
   * Static method to validate order put request
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static put(req, res, next) {
    // check if order id is valid
    if (!Number.isInteger(parseInt(req.params.id, 10))) return res.status(400).send({ message: 'Order id is invalid' });

    // get order object
    const existingOrder = orders.get(parseInt(req.params.id, 10));

    // check if order id exists
    if (!orders.get(parseInt(req.params.id, 10))) {
      return res.status(404).send({ message: 'Order does not exist' });
    }

    // check if order status is provided
    if (!req.body.status) return res.status(400).send({ message: 'Status is required' });

    // check if order status is valid
    if (!(req.body.status === 'pending') && !(req.body.status === 'complete') && !(req.body.status === 'canceled')) {
      return res.status(400).send({ message: 'Status is invalid' });
    }

    // check user is a customer
    if (req.decoded.user.accountType === 'customer') {
      // check if customer is the owner of the order
      if (existingOrder.userId !== req.decoded.user.id) {
        return res.status(403).send({ message: 'Unauthorized Access' });
      }

      // check if customer order status is canceled
      if (req.body.status !== 'canceled') {
        return res.status(403).send({ message: 'Can only change status to canceled' });
      }
    }

    // check if order status from db is pending
    if (existingOrder.status !== 'pending') {
      return res.status(403).send({ message: 'Cannot change status' });
    }

    // call next function
    return next();
  }
}

export default ValidateOrder;
