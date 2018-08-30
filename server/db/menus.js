import { isEmpty } from 'lodash';
import { Op, Sequelize } from 'sequelize';
import { getNormalDate } from '../utils/dateBeautifier';
import MealUtils from '../utils/meals/mealUtils';
import { Menus as MenuModel, Meals as MealModel } from '../models';
import paginator from '../utils/paginator';

/**
 * Menu model class
 * Performs CRUD operations on a menu
 */
class Menus {
  /**
   * static method to add menu to the db
   * @param {object} menu
   * @returns {object} {new menu} | {err}
   */
  static async add(menu) {
    // check if date is provided
    if (!menu.date.trim()) return { err: new Error('Menu date is required') };

    // check if date is valid
    if (!getNormalDate(menu.date.trim())) {
      return { err: new Error('Menu date is invalid') };
    }

    // check if menu date exists

    // check if user id is provided
    if (!menu.userId) return { err: new Error('User id is required') };

    // check if mealIds are provided
    if (!menu.mealIds) return { err: new Error('Meal Ids are required') };

    // check if mealIds are in an array
    if (!Array.isArray(menu.mealIds)) {
      return { err: new Error('Meal Ids should be in an array') };
    }

    // get list of real meals
    const realMeals = await MealUtils.getRealMeals(menu.mealIds);

    // populate menu to be added
    const newMenu = { ...menu, mealIds: realMeals };
    // newMenu.name = `Menu For ${beautifyDate(menu.date)}`;
    newMenu.userId = menu.userId;
    // add the menu
    return MenuModel.create(newMenu)
      .then(async (savedMenu) => {
        if (savedMenu) {
          await savedMenu.setMeals(newMenu.mealIds);
          return this.get(savedMenu.id);
        }
        return null;
      })
      .catch(error => ({ err: new Error(error.errors[0].message) }));
  }

  /**
   * static method to update a menu
   * @param {object} menu
   * @returns {object} {updated menu} | {err}
   */
  static async update(menu) {
    // check if menu exists

    // check if date is provided
    if (menu.date && !menu.date.trim()) {
      return { err: new Error('Menu date is required') };
    }

    // check if date is valid
    if (menu.date && !getNormalDate(menu.date.trim())) {
      return { err: new Error('Menu date is invalid') };
    }

    // check if mealIds are provided
    if (!menu.mealIds) return { err: new Error('Meal Ids are required') };

    // check if mealIds are in an array
    if (!Array.isArray(menu.mealIds)) {
      return { err: new Error('Meal Ids should be in an array') };
    }

    // populate menu to be updated with new data

    // get real meals in the db
    const pendingMenu = { ...menu };
    pendingMenu.mealIds = await MealUtils.getRealMeals(menu.mealIds);

    // get menu record and update it
    return MenuModel.findById(pendingMenu.id)
      .then(async (returnedMenu) => {
        if (isEmpty(returnedMenu)) {
          return { err: new Error('Menu does not exist') };
        }
        await returnedMenu.update(pendingMenu);
        await returnedMenu.setMeals(pendingMenu.mealIds);
        return this.get(pendingMenu.id);
      });
  }

  /**
   * static method to delete menu using id
   * @param {integer} id
   */
  static delete(id) {
    return MenuModel.findById(id)
      .then((updateMenu) => {
        if (isEmpty(updateMenu)) {
          return { err: new Error('Menu does not exist') };
        }
        return updateMenu.destroy()
          .then(() => null)
          .catch(error => ({ err: new Error(error.errors[0].message) }));
      });
  }

  /**
   * Static method to get menu using menu id
   * @param {integer} id
   * @returns {object | null} {menu}
   */
  static get(id) {
    return MenuModel.findById(id, {
      include: [{
        model: MealModel,
        as: 'meals',
        attributes: { exclude: ['createdAt', 'updatedAt', 'MenuMeals'] },
      }],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['createdAt', 'DESC']],
    }).then((result) => {
      if (isEmpty(result)) {
        return undefined;
      }
      return result;
    });
  }

  /**
   * Static method to get menu using menu date
   * @param {date} date
   * @returns {array} [menus] | {err}
   */
  static getByDate(date, offset = 0, limit = 10) {
    // get normal date format from date passed
    const normalDate = getNormalDate(date);
    // check if date is valid
    if (!normalDate) return { err: new Error('Menu date is invalid') };

    // filter for result by normalDate
    return MenuModel.findAndCountAll({
      where: {
        id: {
          [Op.eq]: Sequelize
            .literal(`(select "id" from "Menus" where "date" = '${normalDate}')`),
        },
      },
      order: [
        ['id', 'DESC'],
      ],
      include: [{
        model: MealModel,
        as: 'meals',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'MenuMeals', 'deletedAt'],
        },
        order: [
          ['id', 'DESC'],
        ],
      }],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      offset,
      limit,
      subQuery: false,
    })
      .then((returnedMenu) => {
        if (isEmpty(returnedMenu.rows)) {
          return {
            menu: {},
            pagination: paginator(limit, offset, 0),
          };
        }
        return {
          menu: returnedMenu.rows[0],
          pagination: paginator(limit, offset, returnedMenu.count),
        };
      })
      .catch(error => ({ err: new Error(error.errors[0].message) }));
  }

  static getByUserId(userId, offset = 0, limit = 10) {
    // filter for result by user id
    return MenuModel.findAndCountAll({
      order: [
        ['id', 'DESC'],
      ],
      include: [{
        model: MealModel,
        as: 'meals',
        where: {
          userId,
        },
        attributes: { exclude: ['createdAt', 'updatedAt', 'MenuMeals'] },
      }],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      limit,
      offset,
    })
      .then((returnedMenu) => {
        if (isEmpty(returnedMenu.rows)) {
          return {
            menus: [],
            pagination: paginator(limit, offset, 0),
          };
        }
        return {
          menus: returnedMenu.rows,
          pagination: paginator(limit, offset, returnedMenu.rows),
        };
      })
      .catch(error => ({ err: new Error(error.errors[0].message) }));
  }

  /**
   * static method to get all menus in the db
   * @returns {array} [menus]
   */
  static getAll(offset = 0, limit = 10) {
    return MenuModel.findAndCountAll({
      order: [
        ['id', 'DESC'],
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      limit,
      offset,
    })
      .then((returnedMenu) => {
        if (isEmpty(returnedMenu.rows)) {
          return {
            menus: [],
            pagination: paginator(limit, offset, 0),
          };
        }
        return {
          menus: returnedMenu.rows,
          pagination: paginator(limit, offset, returnedMenu.count),
        };
      })
      .catch(error => ({ err: new Error(error.errors[0].message) }));
  }

  /**
   * Static method to delete all from Menu db
   */
  static truncate() {
    return MenuModel.sync({ force: true })
      .then(() => null);
  }
}

export default Menus;
