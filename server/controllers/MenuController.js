import { isEmpty } from 'lodash';
import menus from '../db/menus';
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
    const uniqueIds = new Set(req.body.mealIds.sort());
    const mealIds = [...uniqueIds];
    const newMenu = menus.add({ date, mealIds, userId: req.decoded.user.id });
    if (newMenu && !newMenu.err) {
      return res.status(201).send({ menu: newMenu });
    }

    return res.status(500).send({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle put menu requests
   * updates meals in a menu
   * returns meal object
   * @param {*} req
   * @param {*} res
   */
  static put(req, res) {
    const oldMenu = menus.get(parseInt(req.params.id, 10));
    let ids = [...oldMenu, ...req.body.mealIds];
    /**
     * if the user is an admin, then he can remove and add meal options
     * else, caterers can only add meal options
     */
    if (req.decoded.user.accountType === 'admin') {
      ids = [...req.body.mealIds];
    }

    const uniqueIds = new Set(ids.sort());
    const mealIds = [...uniqueIds];
    const newMenu = menus.update({ id: oldMenu.id, mealIds });

    if (newMenu && !newMenu.err) {
      return res.status(201).send({ menu: newMenu });
    }

    console.log('err:', newMenu);

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
    if (accountType === 'caterer' || accountType === 'admin') {
      const menuList = [...menus.getAll()];
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
    if (accountType === 'customer') {
      const menuObject = { ...menus.getByDate(new Date()) };
      if (!isEmpty(menuObject)) {
        const properMenuObject = menuUtils.buildMenu(menuObject);
        return res.status(200).send({ menu: properMenuObject });
      }
      return res.status(404).send({ message: 'Menu for the day not set' });
    }

    return res.status(500).send({ message: 'Internal Server Error' });
  }
}

export default MenuController;
