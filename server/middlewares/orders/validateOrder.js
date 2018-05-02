import meals from '../../db/meals';
import orders from '../../db/orders';
import menus from '../../db/menus';

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
    if (!meals.get(parseInt(req.body.mealId, 10))) return res.status(400).send({ message: 'Meal does not exist' });

    // check if meal exists in the menu
    const menu = menus.getByDate(new Date());
    const mealId = parseInt(req.body.mealId, 10);

    if (!menu) return res.status(400).send({ message: 'No menu is set' });

    if (!menu.mealIds.find(id => id === mealId)) return res.status(400).send({ message: 'Meal does not exist in menu' });

    // check if quantity is valid
    if (!Number.isInteger(parseInt(req.body.quantity, 10))) {
      return res.status(400).send({ message: 'Quantity is invalid' });
    }

    // check if quantity is provided
    if (!parseInt(req.body.quantity, 10)) return res.status(400).send({ message: 'Quantity is required' });

    // check if quantity is greater than 0
    if (parseInt(req.body.quantity, 10) <= 0) return res.status(400).send({ message: 'Quantity should be greater than zero' });

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

    // check if order id exists
    if (!orders.get(parseInt(req.params.id, 10))) {
      return res.status(400).send({ message: 'Order does not exist' });
    }

    // check if meal id is provided and valid
    if (req.body.mealId && !Number.isInteger(parseInt(req.body.mealId, 10))) {
      return res.status(400).send({ message: 'Meal id is invalid' });
    }

    // check if meal id is provided and it exists
    if (req.body.mealId && !meals.get(parseInt(req.body.mealId, 10))) {
      return res.status(400).send({ message: 'Meal does not exist' });
    }

    // check if meal exists in the menu
    if (req.body.mealId) {
      const menu = menus.getByDate(new Date());
      const mealId = parseInt(req.body.mealId, 10);
      if (!menu.mealIds.find(id => id === mealId)) return res.status(400).send({ message: 'Meal does not exist in menu' });
    }

    // check if quantity is provided and valid
    if (req.body.quantity && !Number.isInteger(parseInt(req.body.quantity, 10))) {
      return res.status(400).send({ message: 'Quantity is invalid' });
    }

    const quantity = parseInt(req.body.quantity, 10);
    // check if quantity is provided and greater than 0
    if (quantity <= 0) {
      return res.status(400).send({ message: 'Quantity should be greater than zero' });
    }

    // get order object
    const existingOrder = orders.get(parseInt(req.params.id, 10));

    // check if order status is provided
    if (!req.body.status) return res.status(400).send({ message: 'Status is required' });

    // check if order status is valid
    if (!(req.body.status === 'pending') && !(req.body.status === 'complete') && !(req.body.status === 'canceled')) {
      return res.status(400).send({ message: 'Status is invalid' });
    }

    // check if order status from db is not pending
    if (existingOrder.status !== 'pending') {
      return res.status(403).send({ message: 'Cannot change status' });
    }

    // check user is a customer
    if (req.decoded.user.accountType === 'customer') {
      // check if customer is the owner of the order
      if (existingOrder.userId !== req.decoded.user.id) {
        return res.status(403).send({ message: 'Unauthorized Access' });
      }

      // check if customer order status is complete
      if (req.body.status === 'complete') {
        return res.status(403).send({ message: 'Can only update status with canceled or pending' });
      }

      return next();
    }

    // confirm that only customers are allowed to update meal option and price
    if (req.body.mealId || req.body.quantity) {
      return res.status(403).send({ message: 'Only customers are allowed to change meal option or quantity' });
    }

    // get meal id, either from req body or order db object
    const mId = req.body.mealId || existingOrder.mealId;

    // check if user is not an admin and not the owner of the meal id present in the order
    if (req.decoded.user.accountType !== 'admin' &&
        req.decoded.user.id !== meals.get(parseInt(mId, 10)).userId) {
      return res.status(403).send({ message: 'Unauthorized access' });
    }

    // call next function
    return next();
  }
}

export default ValidateOrder;
