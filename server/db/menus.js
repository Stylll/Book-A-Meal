import { isEmpty } from 'lodash';
import { getNormalDate, beautifyDate } from '../utils/dateBeautifier';
import MealUtils from '../utils/meals/mealUtils';
import { menus as MenuModel } from '../models/menus';

// variable to store the menu records.
const MenuStore = [];

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
    if (!getNormalDate(menu.date.trim())) return { err: new Error('Menu date is invalid') };

    // check if menu date exists
    if (MenuStore.filter(x => x.date === menu.date.trim()).length > 0) {
      return { err: new Error('Menu date already exists') };
    }

    // check if user id is provided
    if (!menu.userId) return { err: new Error('User id is required') };

    // check if mealIds are provided
    if (!menu.mealIds) return { err: new Error('Meal Ids are required') };

    // check if mealIds are in an array
    if (!Array.isArray(menu.mealIds)) return { err: new Error('Meal Ids should be in an array') };

    // get list of real meals
    const realMeals = await MealUtils.getRealMeals(menu.mealIds);

    // populate menu to be added
    const newMenu = { ...menu, mealIds: realMeals };
    newMenu.name = `Menu For ${beautifyDate(menu.date)}`;
    newMenu.userId = menu.userId;

    // add the menu
    return MenuModel.create(newMenu)
      .then((savedMenu) => {
        if (savedMenu) {
          return savedMenu.dataValues;
        }
        return null;
      })
      .catch(error => ({ err: new Error(error.errors[0].message) }));
  }

  /**
   * Static method to add multiple menu to the db
   * @param {array} menuArray
   */
  static addBulk(menuArray) {
    menuArray.forEach((menu) => {
      this.add(menu);
    });
  }

  /**
   * static method to update a menu
   * @param {object} menu
   * @returns {object} {updated menu} | {err}
   */
  static update(menu) {
    // check if menu exists
    if (!MenuStore[menu.id - 1]) {
      return { err: new Error('Menu does not exist') };
    }

    // check if date is provided
    if (menu.date && !menu.date.trim()) return { err: new Error('Menu date is required') };

    // check if date is valid
    if (menu.date && !getNormalDate(menu.date.trim())) return { err: new Error('Menu date is invalid') };

    // check if mealIds are provided
    if (!menu.mealIds) return { err: new Error('Meal Ids are required') };

    // check if mealIds are in an array
    if (!Array.isArray(menu.mealIds)) return { err: new Error('Meal Ids should be in an array') };

    // populate menu to be updated with new data
    const updatedMenu = { ...MenuStore[menu.id - 1] };
    updatedMenu.name = (menu.date) ? `Menu For ${beautifyDate(menu.date)}` : updatedMenu.name;
    updatedMenu.date = menu.date || updatedMenu.date;
    updatedMenu.mealIds = MealUtils.getRealMeals(menu.mealIds);
    updatedMenu.updatedAt = new Date();

    // get menu record and update it
    return MenuModel.findById(menu.id)
      .then((returnedMenu) => {
        if (isEmpty(returnedMenu)) {
          return { err: new Error('Menu does not exist') };
        }
        return returnedMenu.update(menu)
          .then((updateMenu) => {
            if (updateMenu) {
              return updateMenu.dataValues;
            }
            return null;
          })
          .catch(error => ({ err: new Error(error.errors[0].message) }));
      });

    // return updated menu
    return updatedMenu;
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
    return MenuModel.findById(id)
      .then((returnedMenu) => {
        if (isEmpty(returnedMenu)) {
          return undefined;
        }
        return returnedMenu.dataValues;
      })
      .catch(error => ({ err: new Error(error.errors[0].message) }));
  }

  /**
   * Static method to get menu using menu date
   * @param {date} date
   * @returns {array} [menus] | {err}
   */
  static getByDate(date) {
    // check if date is valid
    if (!getNormalDate(date)) return { err: new Error('Menu date is invalid') };

    // get normal date format from date passed
    const normalDate = getNormalDate(date);

    // filter for result by normalDate
    const result = MenuStore.filter(x => x.date === normalDate);
    if (result.length > 0) {
      return result[0];
    }
    return null;
  }

  /**
   * static method to get all menus in the db
   * @returns {array} [menus]
   */
  static getAll() {
    return MenuStore;
  }

  /**
   * Static method to delete all from Menu db
   */
  static truncate() {
    MenuStore.length = 0;
  }
}

export default Menus;
