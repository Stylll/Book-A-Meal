import { isEmpty } from 'lodash';
import menus from '../db/menus';
import Models from '../models';
import { getNormalDate } from '../utils/dateBeautifier';
import Notifications from '../utils/mailer/Notifications';
import { processMealIds } from '../utils/controllerUtils';
import paginator from '../utils/paginator';

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
    const newMenu = await menus.add({
      date,
      mealIds,
      userId: request.decoded.user.id,
    });
    if (newMenu && !newMenu.err) {
      Notifications.customerMenuNotifier(request.headers.host, newMenu);
      return response.status(201)
        .json({ menu: newMenu, message: 'Created successfully' });
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
    const currentDate = getNormalDate(new Date());

    if (newMenu && !newMenu.err) {
      const menuDate = newMenu.dataValues.date;
      if (menuDate === currentDate) {
        Notifications.customerMenuNotifier(request.headers.host, newMenu);
      }
      return response.status(200)
        .json({ menu: newMenu, message: 'Updated successfully' });
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
    const limit = request.query.limit || 10;
    const offset = request.query.offset || 0;

    /**
     * if accounttype is admin,
     * then we get all menus in the db
     * and return them as an array
     */
    if (accountType === 'admin') {
      const menuList = await menus.getAll(offset, limit);
      return response.status(200)
        .json({ menus: menuList.menus, pagination: menuList.pagination });
    }

    if (accountType === 'caterer') {
      const menuList = await menus.getAll(offset, limit);
      return response.status(200)
        .json({ menus: menuList.menus, pagination: menuList.pagination });
    }

    /**
     * accounttype is customer,
     * we get the menu for current date
     * and return it as an object
     */
    if (accountType === 'customer') {
      const menuObject = await menus.getByDate(new Date(), offset, limit);
      if (!isEmpty(menuObject.menu)) {
        return response.status(200)
          .json({ menu: menuObject.menu, pagination: menuObject.pagination });
      }
      return response.status(404).json({ message: 'Menu for the day not set' });
    }

    return response.status(500).json({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle getting single menu with meals
   * @param {object} request
   * @param {object} response
   * @returns {object} {menus} | {message}
   */
  static async getMenuWithMeals(request, response) {
    const { id } = request.params;
    const { accountType } = request.decoded.user;
    const userId = request.decoded.user.id;
    const limit = request.query.limit || 10;
    const offset = request.query.offset || 0;
    const where = {};
    if (accountType === 'caterer') {
      where.userId = userId;
    }
    const menuResponse = await Models.Menus.findAndCountAll({
      where: {
        id,
      },
      order: [
        ['id', 'DESC'],
      ],
      include: [{
        model: Models.Meals,
        as: 'meals',
        where,
        required: false,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'MenuMeals', 'deletedAt'],
        },
        order: [
          ['id', 'DESC'],
        ],
        include: [{
          model: Models.Users,
          as: 'user',
          attributes: {
            exclude: ['accountType', 'password', 'resetPasswordToken', 'resetPasswordExpires',
              'createdAt', 'updatedAt'],
          },
        }],
      }],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      limit,
      offset,
      subQuery: false,
    });
    if (isEmpty(menuResponse.rows)) {
      return response.status(404)
        .json({
          menu: {},
          pagination: paginator(limit, offset, 0),
        });
    }

    return response.status(200)
      .json({
        menu: menuResponse.rows[0],
        pagination: paginator(limit, offset, menuResponse.count),
      });
  }
}

export default MenuController;
