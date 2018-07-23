import { isEmpty } from 'lodash';
import menus from '../db/menus';
import { getNormalDate } from '../utils/dateBeautifier';
import Notifications from '../utils/mailer/Notifications';
import { processMealIds } from '../utils/controllerUtils';

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
  static async post(request, response) {
    const date = getNormalDate(new Date());
    const uniqueIds = new Set(request.body.mealIds.sort());
    const mealIds = [...uniqueIds];
    const newMenu = await menus.add({ date, mealIds, userId: request.decoded.user.id });
    if (newMenu && !newMenu.err) {
      Notifications.customerMenuNotifier(request.headers.host, newMenu);
      return response.status(201).json({ menu: newMenu, message: 'Created successfully' });
    }

    return response.status(500).json({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle put menu requests
   * updates meals in a menu
   * returns menu object
   * @param {object} request
   * @param {object} response
   * @returns {object} {menu, message} | {message}
   */
  static async put(request, response) {
    const oldMenu = await menus.get(parseInt(request.params.id, 10));
    let ids = [...oldMenu.dataValues.mealIds, ...request.body.mealIds];
    /**
     * if the user is an admin, then he can remove and add meal options
     * else, caterers can only remove and add meals created by him.
     */
    if (request.decoded.user.accountType === 'admin') {
      ids = [...request.body.mealIds];
    } else {
      ids = processMealIds(
        oldMenu.dataValues,
        request.body.mealIds, request.decoded.user.id,
      );
    }

    const uniqueIds = new Set(ids.sort());
    const mealIds = [...uniqueIds];
    const newMenu = await menus.update({ id: oldMenu.id, mealIds });

    if (newMenu && !newMenu.err) {
      return response.status(200).json({ menu: newMenu, message: 'Updated successfully' });
    }

    return response.status(500).json({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle get menu requests
   * returns an array of menus for caterer
   * returns an object of current day's menu for customer
   * @param {object} request
   * @param {object} response
   * @returns {object} {menus} | {message}
   */
  static async get(request, response) {
    const { accountType, id } = request.decoded.user;

    /**
     * if accounttype is admin,
     * then we get all menus in the db
     * and return them as an array
     */
    if (accountType === 'admin') {
      const menuList = await menus.getAll();
      if (menuList.length > 0) {
        return response.status(200).json({ menus: menuList });
      }
      return response.status(200).json({ menus: [] });
    }

    /**
     * if accounttype is caterer,
     * then we get all menus in the db
     * and show only meals created by the caterer
     */
    if (accountType === 'caterer') {
      const menuList = await menus.getByUserId(id);
      if (menuList.length > 0) {
        return response.status(200).json({ menus: menuList });
      }
      return response.status(200).json({ menus: [] });
    }

    /**
     * accounttype is customer,
     * we get the menu for current date
     * and return it as an object
     */
    if (accountType === 'customer') {
      const menuObject = await menus.getByDate(new Date());
      if (!isEmpty(menuObject)) {
        return response.status(200).json({ menu: menuObject });
      }
      return response.status(404).json({ message: 'Menu for the day not set' });
    }

    return response.status(500).json({ message: 'Internal Server Error' });
  }
}

export default MenuController;
