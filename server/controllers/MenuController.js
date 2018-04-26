import menus from '../db/menus';
import menuMeals from '../db/menuMeals';
import { getNormalDate } from '../utils/dateBeautifier';
import menuUtils from '../utils/menu/menuUtils';

/**
 * Controller Class to handle user Menu requests
 */
class MenuController {
  /**
   * static method to handle menu post requests
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
      menuId: parseInt(req.params.id, 10),
      mealId: parseInt(req.body.mealId, 10),
    };

    // save meal in the db
    const newMeal = menuMeals.add(meal);

    // return new meal if save was successful
    if (newMeal && !newMeal.err) {
      return res.status(201).send({ menuMeal: newMeal });
    }
    return res.status(500).send({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle get menu requests
   * returns an array of menus for caterer
   * returns an object of current day's menu for customer
   * @param {*} req
   * @param {*} res
   */
  static get(req, res) {
    const { accountType } = req.decoded.user;

    /**
     * if accounttype is caterer,
     * then we get all menus in the db
     * and return them as an array
     */
    if (accountType === 'caterer') {
      const menuList = { ...menus.getAll() };
      if (menuList.length > 0) {
        const properMenuList = menuUtils.buildMenus(menuList);
        return res.status(200).send({ menus: properMenuList });
      }
      return res.status(200).send({ menus: [] });
    }
    /**
     * accounttype is customer,
     * we get the menu for current date
     * and return it as an object
     */
    const menuObject = { ...menus.getByDate(new Date()) };
    if (menuObject) {
      const properMenuObject = menuUtils.buildMenu(menuObject);
      return res.status(200).send({ menu: properMenuObject });
    }
    return res.status(404).send({ message: 'Menu for the day not set' });
  }
}

export default MenuController;
