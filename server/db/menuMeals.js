import generateId from '../utils/generateId';
import menus from './menus';
import meals from './meals';

// variable to store the menu records.
const MenuMealStore = [];

/**
 * Menu model class
 * Performs CRUD operations on a menu
 */
class MenuMeals {
  /**
   * Static method to add menumeal to db
   * @param {object} menuMeal
   * @return {object} menuMeal
   */
  static add(menuMeal) {
    // check if menu id is provided
    if (!menuMeal.menuId) return { err: new Error('Menu id is required') };

    // check if menu id is valid
    if (!Number.isInteger(menuMeal.menuId)) return { err: new Error('Menu id is invalid') };

    // check if menu exists
    if (!menus.get(menuMeal.menuId)) return { err: new Error('Menu does not exist') };

    // check if meal id is provided
    if (!menuMeal.mealId) return { err: new Error('Meal id is required') };

    // check if meal id is valid
    if (!Number.isInteger(menuMeal.mealId)) return { err: new Error('Meal id is invalid') };

    // check if meal exists
    if (!meals.get(menuMeal.mealId)) return { err: new Error('Meal does not exist') };

    // check if meal exists in menumeal db
    const result = this.getByMenuId(menuMeal.menuId);
    if (result) {
      const resMeal = result.filter(item => item.mealId === menuMeal.mealId);
      if (resMeal.length > 0) {
        return { err: new Error('Meal already exists') };
      }
    }

    // populate menu to be updated with new data
    const newMenuMeal = { ...menuMeal };
    newMenuMeal.id = generateId(MenuMealStore);
    newMenuMeal.createdAt = new Date();
    newMenuMeal.updatedAt = new Date();

    // save new record
    MenuMealStore.push(newMenuMeal);

    return newMenuMeal;
  }

  /**
   * Static method to add bulk menumeal records to the db
   * @param {array} menuMealArray
   */
  static addBulk(menuMealArray) {
    menuMealArray.forEach((menumeal) => {
      this.add(menumeal);
    });
  }

  /**
   * static method to delete a menu meal record by id
   * @param {integer} menuMealId
   */
  static delete(id) {
    if (Number.isInteger(id)) {
      delete MenuMealStore[id - 1];
    }
  }

  /**
   * static method to delete a menu meal record by menu id
   * @param {integer} id
   *
   */
  static deleteByMenuId(id) {
    if (Number.isInteger(id)) {
      const result = MenuMealStore.filter(menumeal => menumeal.menuId === id);
      if (result.length > 0) {
        result.forEach((item) => {
          delete MenuMealStore[item.id];
        });
      }
    }
  }

  /**
   * static method to get menu meal by id
   * @param {integer} id
   * @return {object|null} menumeal | null
   */
  static get(id) {
    if (Number.isInteger(id)) {
      return MenuMealStore[id - 1];
    }
    return null;
  }

  /**
   * static method to get menumeal by menu id
   * @param {integer} menuId
   * @return {object|null} menumeal | null
   */
  static getByMenuId(id) {
    if (Number.isInteger(id)) {
      const result = MenuMealStore.filter(menumeal => menumeal.menuId === id);
      if (result.length > 0) {
        return result[0];
      }
      return null;
    }
    return null;
  }

  /**
   * Static method to return all records in the db
   */
  static getAll() {
    return MenuMealStore;
  }

  /**
   * static method to remove every record in the db
   */
  static truncate() {
    MenuMealStore.length = 0;
  }
}

export default MenuMeals;
