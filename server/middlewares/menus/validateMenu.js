import menuMeals from '../../db/menuMeals';
import menus from '../../db/menus';
import meals from '../../db/meals';

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
  static postMeal(req, res, next) {
    // check if menu id is provided
    if (!req.params.id) return res.status(400).send({ message: 'Menu id is required' });

    // check if menu id is valid
    if (!Number.isInteger(parseInt(req.params.id, 10))) {
      return res.status(400).send({ message: 'Menu id is invalid' });
    }

    // check if menu id exists
    if (!menus.get(parseInt(req.params.id, 10))) return res.status(404).send({ message: 'Menu does not exist' });

    // check if meal id is provided
    if (!req.body.mealId) return res.status(400).send({ message: 'Meal id is required' });

    // check if meal id is valid
    if (!Number.isInteger(req.body.mealId)) {
      return res.status(400).send({ message: 'Meal id is invalid' });
    }

    // check if meal id exists in meals db
    if (!meals.get(req.body.mealId)) return res.status(404).send({ message: 'Meal does not exist' });

    // check if meal id exists in menumeals db
    const result = menuMeals.getByMenuId(req.params.id);
    if (result) {
      // get meal using mealId if exists
      const meal = result.filter(x => x.mealId === req.body.mealId);
      if (meal.length > 0) {
        // means the meal exists in the menu already
        return res.status(409).send({ message: 'Meal already exists' });
      }
    }

    return next();
  }
}

export default ValidateMenu;
