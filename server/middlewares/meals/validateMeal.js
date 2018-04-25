import meals from '../../db/meals';

/**
 * Middleware class to validate Meal
 */
class ValidateMeal {
  /**
   * Static method to validate meal post request
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static post(req, res, next) {
    // check if meal name is provided
    if (!req.body || (!req.body.name || !req.body.name.trim())) return res.status(400).send({ message: 'Meal name is required' });

    // check if meal name exists
    if (meals.getByName(req.body.name.trim())) return res.status(409).send({ message: 'Meal name already exists' });

    // check if price is provided
    if (!req.body.price) return res.status(400).send({ message: 'Price is required' });

    // check if price is valid
    if (/[^0-9.]/gi.test(req.body.price) === true) {
      return res.status(400).send({ message: 'Price is invalid' });
    }

    // check if price is above one
    if (req.body.price <= 1) return res.status(400).send({ message: 'Price must be greater than one' });

    return next();
  }

  /**
   * Static method to validate meal put requests
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static put(req, res, next) {
    // check if meal id exists
    if (!meals.get(parseInt(req.params.id, 10))) {
      return res.status(404).send({ message: 'Meal does not exist' });
    }

    // check if meal name exists
    if (req.body.name.trim() && meals.getByName(req.body.name.trim())) {
      return res.status(409).send({ message: 'Meal name already exists' });
    }

    // check if price is valid
    if (req.body.price && /[^0-9.]/gi.test(req.body.price) === true) {
      return res.status(400).send({ message: 'Price is invalid' });
    }

    // check if price is above one
    if (req.body.price && req.body.price <= 1) {
      return res.status(400).send({ message: 'Price must be greater than one' });
    }

    return next();
  }

  /**
   * Static method to validate meal delete requests
   * @param {*} req
   * @param {*} res
   */
  static delete(req, res, next) {
    // check if meal exists
    if (!meals.get(parseInt(req.params.id, 10))) {
      return res.status(404).send({ message: 'Meal does not exist' });
    }
    return next();
  }
}

export default ValidateMeal;
