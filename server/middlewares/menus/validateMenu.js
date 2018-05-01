import menus from '../../db/menus';
/**
 * Middleware class to validate Meal
 */
class ValidateMenu {
  /**
   * static middleware method to validate menu post requests
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static post(req, res, next) {
    // check if date already exists
    if (menus.getByDate(new Date())) {
      return res.status(400).send({ message: 'Menu for the day already exists' });
    }

    // check if meal id array is provided
    if (!req.body.mealIds) return res.status(400).send({ message: 'Array of meal ids is required' });

    // check if meal id array is valid
    if (!Array.isArray(req.body.mealIds)) {
      return res.status(400).send({ message: 'Meal ids must be in an array' });
    }

    return next();
  }

  /**
   * static middleware method to validate menu put requests
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static put(req, res, next) {
    // check if menu id is valid
    if (!Number.isInteger(parseInt(req.params.id, 10))) {
      return res.status(400).send({ message: 'Menu id is invalid' });
    }

    // check if menu id exists
    if (!menus.get(parseInt(req.params.id, 10))) return res.status(400).send({ message: 'Menu does not exist' });

    // check if meal id array is provided
    if (!req.body.mealIds) return res.status(400).send({ message: 'Array of meal ids is required' });

    // check if meal id array is valid
    if (!Array.isArray(req.body.mealIds)) {
      return res.status(400).send({ message: 'Meal ids must be in an array' });
    }

    return next();
  }
}

export default ValidateMenu;
