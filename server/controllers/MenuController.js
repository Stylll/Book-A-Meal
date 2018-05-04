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
   * @param {object} request
   * @param {object} response
   * @returns {object} {menu, message} | {message}
   */
  static post(request, response) {
    const date = getNormalDate(new Date());
    const uniqueIds = new Set(request.body.mealIds.sort());
    const mealIds = [...uniqueIds];
    const newMenu = menus.add({ date, mealIds, userId: request.decoded.user.id });
    if (newMenu && !newMenu.err) {
      return response.status(201).send({ menu: newMenu, message: 'Created successfully' });
    }

    return response.status(500).send({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle put menu requests
   * updates meals in a menu
   * returns menu object
   * @param {object} request
   * @param {object} response
   * @returns {object} {menu, message} | {message}
   */
  static put(request, response) {
    const oldMenu = menus.get(parseInt(request.params.id, 10));
    let ids = [...oldMenu, ...request.body.mealIds];
    /**
     * if the user is an admin, then he can remove and add meal options
     * else, caterers can only add meal options
     */
    if (request.decoded.user.accountType === 'admin') {
      ids = [...request.body.mealIds];
    }

    const uniqueIds = new Set(ids.sort());
    const mealIds = [...uniqueIds];
    const newMenu = menus.update({ id: oldMenu.id, mealIds });

    if (newMenu && !newMenu.err) {
      return response.status(201).send({ menu: newMenu, message: 'Updated successfully' });
    }

    return response.status(500).send({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle get menu requests
   * returns an array of menus for caterer
   * returns an object of current day's menu for customer
   * @param {object} request
   * @param {object} response
   * @returns {object} {menus} | {message}
   */
  static get(request, response) {
    const { accountType } = request.decoded.user;

    /**
     * if accounttype is caterer,
     * then we get all menus in the db
     * and return them as an array
     */
    if (accountType === 'caterer' || accountType === 'admin') {
      const menuList = [...menus.getAll()];
      if (menuList.length > 0) {
        const properMenuList = menuUtils.buildMenus(menuList);
        return response.status(200).send({ menus: properMenuList });
      }
      return response.status(200).send({ menus: [] });
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
        return response.status(200).send({ menu: properMenuObject });
      }
      return response.status(404).send({ message: 'Menu for the day not set' });
    }

    return response.status(500).send({ message: 'Internal Server Error' });
  }
}

export default MenuController;
