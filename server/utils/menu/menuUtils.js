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
  static buildMenu(menuObject, catererId = null) {
    const menu = { ...menuObject };
    const mealIds = [];
    menu.meals = [];

    if (menu.mealIds && menu.mealIds.length > 0) {
      /**
       * for each meal list,
       * get actual meal object
       * push it into the menu.meals array
       */
      menu.mealIds.forEach((id) => {
        const meal = meals.get(id);

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
      });
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
  static buildMenus(menuArray, catererId = null) {
    let menuList = [...menuArray];
    menuList = menuList.map(menu => this.buildMenu(menu, catererId));
    return menuList;
  }
}

export default MenuUtils;
