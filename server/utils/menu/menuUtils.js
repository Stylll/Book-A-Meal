import meals from '../../db/meals';

/**
 * Class to implement functions related
 * to menu objects and requests
 */

class MenuUtils {
  /**
   * Static method to build complete menu
   * add meal objects to the menu
   * if catererId is passed, then only meals created by the caterer will be returned
   * @param {object} menuObject
   * @returns {object} complete menu
   */
  static async buildMenu(menuObject, catererId = null) {
    const menu = { ...menuObject };
    const mealIds = [];
    menu.meals = [];

    if (menu.mealIds && menu.mealIds.length > 0) {
      /**
       * for each meal list,
       * get actual meal object
       * push it into the menu.meals array
       */
      /* eslint-disable no-plusplus */
      for (let i = 0; i < menu.mealIds.length; i++) {
        const id = menu.mealIds[i];
        /* eslint-disable no-await-in-loop */
        const meal = await meals.get(parseInt(id, 10));

        /**
         * if caterer id is provided,
         * check if meal was created by user before adding
         * else, add meal to menu
         */
        if (catererId && meal && meal.userId === catererId) {
          menu.meals.push(meal);
          mealIds.push(meal.id);
        } else if (!catererId && meal) {
          menu.meals.push(meal);
          mealIds.push(meal.id);
        }
      }
    }


    // update mealIds with the id of meals displayed
    menu.mealIds = [...mealIds];

    return menu;
  }

  /**
   * Static method to build complete menus in an array
   * calls buildMenu method with each item in the array
   * if catererId is passed, then only meals created by the caterer will be returned
   * @param {array} menuArray
   * @param {integer} catererId
   * @returns {array} completeMenuArray
   */
  static async buildMenus(menuArray, catererId = null) {
    let menuList = [...menuArray];
    menuList = await Promise.all(menuList.map(async menu => this.buildMenu(menu, catererId)));
    return menuList;
  }
}

export default MenuUtils;
