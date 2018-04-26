import meals from '../../db/meals';

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
    if (!Number.isInteger(req.body.mealId)) return res.status(400).send({ message: 'Meal id is invalid' });

    // check if meal id exists
    if (!meals.get(req.body.mealId)) return res.status(404).send({ message: 'Meal does not exist' });

    // check if price is provided
    if (!req.body.price) return res.status(400).send({ message: 'Price is required' });

    // check if price is a number
    if (/[^0-9.]/gi.test(req.body.price) === true) {
      return res.status(400).send({ message: 'Price is invalid' });
    }

    // check if price is less than or equal to 1
    if (req.body.price <= 1) return res.status(400).send({ message: 'Price must be greater than one' });

    // check if quantity is provided
    if (!req.body.quantity) return res.status(400).send({ message: 'Quantity is required' });

    // check if quantity is valid
    if (!Number.isInteger(req.body.quantity)) return res.status(400).send({ message: 'Quantity is invalid' });

    // check if user id is provided
    if (!req.decoded.user.id) return res.status(400).send({ message: 'User id is required' });

    // check if user id is valid
    if (!Number.isInteger(req.decoded.user.id)) return res.status(400).send({ message: 'User id is invalid' });

    // return next if no error
    return next();
  }
}

export default ValidateOrder;
