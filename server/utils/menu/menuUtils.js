import meals from '../../db/meals';
import menuMeals from '../../db/menuMeals';

/**
 * Class to implement functions related
 * to menu objects and requests
 */

class MenuUtils {
  /**
   * Static method to build complete menu
   * add meal objects to the menu
   * @param {object} menuObject
   * @returns {object} complete menu
   */
  static buildMenu(menuObject) {
    const menu = { ...menuObject };
    menu.meals = [];

    // get the list of set meal for the menu
    const menuMealArray = menuMeals.getByMenuId(menu.id);

    if (menuMealArray && menuMealArray.length > 0) {
      /**
       * for each meal list,
       * get actual meal object
       * push it into the menu.meals array
       */
      menuMealArray.forEach((m) => {
        const meal = meals.get(m.id);
        if (meal) menu.meals.push(meal);
      });
    }

    return menu;
  }

  /**
   * Static method to build complete menus in an array
   * calls buildMenu method with each item in the array
   * @param {array} menuArray
   * @returns {array} completeMenuArray
   */
  static buildMenus(menuArray) {
    let menuList = [...menuArray];
    menuList = menuList.map(menu => this.buildMenu(menu));
    return menuList;
  }
}

export default MenuUtils;
