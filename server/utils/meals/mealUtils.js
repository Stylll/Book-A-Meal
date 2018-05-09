import Meals from '../../db/meals';

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
  static async getRealMeals(mealArray) {
    const newArr = [];
    for (let i = 0; i < mealArray.length; i++) {
      const meal = await Meals.get(mealArray[i]);
      if (meal) newArr.push(meal.id);
    }
    return newArr;
  }
}

export default MealUtils;
