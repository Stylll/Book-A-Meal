import generateId from '../utils/generateId';
import { getNormalDate, beautifyDate } from '../utils/dateBeautifier';

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
   */
  static add(menu) {
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

    // populate menu to be added
    const newMenu = { ...menu };
    newMenu.id = generateId(MenuStore);
    newMenu.name = `Menu For ${beautifyDate(menu.date)}`;
    newMenu.userId = menu.userId;
    newMenu.createdAt = new Date();
    newMenu.updatedAt = new Date();

    // add the menu
    MenuStore.push(newMenu);

    return newMenu;
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
   */
  static update(menu) {
    // check if menu exists
    if (!MenuStore[menu.id - 1]) {
      return { err: new Error('Menu does not exist') };
    }

    // check if date is provided
    if (!menu.date.trim()) return { err: new Error('Menu date is required') };

    // check if date is valid
    if (!getNormalDate(menu.date.trim())) return { err: new Error('Menu date is invalid') };

    // check if menu date exists
    if (MenuStore.filter(x => x.date === menu.date.trim()).length > 0) {
      return { err: new Error('Menu date already exists') };
    }

    // populate menu to be updated with new data
    const updatedMenu = { ...MenuStore[menu.id - 1] };
    updatedMenu.name = `Menu For ${beautifyDate(menu.date)}`;
    updatedMenu.date = menu.date;
    updatedMenu.updatedAt = new Date();

    // save menu in db
    MenuStore[menu.id - 1] = updatedMenu;

    // return updated menu
    return updatedMenu;
  }

  /**
   * static method to delete menu using id
   * @param {integer} id
   */
  static delete(id) {
    delete MenuStore[id - 1];
  }

  /**
   * Static method to get menu using menu id
   * @param {integer} id
   */
  static get(id) {
    if (Number.isInteger(id)) {
      return MenuStore[id - 1];
    }
    return null;
  }

  /**
   * Static method to get menu using menu date
   * @param {date} date
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
