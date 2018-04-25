import menus from '../db/menus';
import menuMeals from '../db/menuMeals';
import { getNormalDate } from '../utils/dateBeautifier';

/**
 * Controller Class to handle user meal requests
 */
class MenuController {
  /**
   * static method to handle post requests
   * creates new menu
   * returns menu
   * @param {*} req
   * @param {*} res
   */
  static post(req, res) {
    const date = getNormalDate(new Date());
    const newMenu = menus.add({ date, userId: req.decoded.user.id });

    if (newMenu && !newMenu.err) {
      return res.status(201).send({ menu: newMenu });
    }

    return res.status(500).send({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle post meal requests
   * adds meal to a menu
   * returns meal object
   * @param {*} req
   * @param {*} res
   */
  static postMeal(req, res) {
    // create meal object
    const meal = {
      menuId: req.params.id,
      mealId: req.body.mealId,
    };

    // save meal in the db
    const newMeal = menuMeals.add(meal);

    // return new meal if save was successful
    if (newMeal && !newMeal.err) {
      return res.status(201).send({ meal: newMeal });
    }
    return res.status(500).send({ message: 'Internal Server Error' });
  }
}

export default MenuController;
