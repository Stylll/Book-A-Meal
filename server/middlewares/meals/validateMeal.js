import meals from '../../db/meals';

/**
 * Middleware class to validate Meal
 */
class ValidateMeal {
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
}

export default ValidateMeal;
