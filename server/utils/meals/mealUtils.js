import meals from '../../db/meals';

/**
 * Class to implement functions related
 * to meal objects and requests
 */

class MealUtils {
  /**
   * static method to check if the meals id exists in the db
   * return an array of meals that exists in the db
   * @param {array} mealArray
   * @returns {array} existingMeals
   */
  static getRealMeals(mealArray) {
    const newArr = mealArray.filter(mealId => (meals.get(mealId)));
    return newArr;
  }
}

export default MealUtils;
