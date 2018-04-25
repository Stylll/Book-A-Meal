import generateId from '../utils/generateId';

// variable to store meal records
const MealStore = [];

class Meals {
  /**
   * static method to add meal to the db
   * @param {object} meal
   * @returns {object} newly added meal
   */
  static add(meal) {
    // check if meal name is provided
    if (!meal.name.trim()) return { err: new Error('Meal name is required') };

    // check if meal name is exists
    if (MealStore.filter(x => x.name === meal.name.trim()).length > 0) {
      return { err: new Error('Meal name already exists') };
    }

    // check if price exists
    if (!meal.price) return { err: new Error('Price is required') };

    // check if price is number
    if (/[^0-9.]/gi.test(meal.price) === true) {
      return { err: new Error('Price is invalid') };
    }

    // check if price is less than one
    if (meal.price <= 1) return { err: new Error('Price must be greater than 1') };

    // check if image link exists
    if (!meal.image.trim()) return { err: new Error('Image link is required') };

    // check if user id is provided
    if (!meal.userId) return { err: new Error('User id is required') };

    // add meal to db
    const newMeal = { ...meal };
    newMeal.id = generateId(MealStore); // generate meal id
    newMeal.createdAt = new Date();
    newMeal.updatedAt = new Date();
    MealStore.push(newMeal);

    return newMeal;
  }

  /**
   * static method to add bulk meals to the db
   * @param {*} mealArray
   */
  static addBulk(mealArray) {
    mealArray.forEach((meal) => {
      this.add(meal);
    });
  }

  /**
   * static method to update meal
   * @param {*} meal
   * @return {object} updated meal
   */
  static update(meal) {
    // if meal does not exist using id
    if (!MealStore[meal.id - 1]) {
      return { err: new Error('Meal does not exist') };
    }

    // check if meal name exists
    if (meal.name.trim() && MealStore.filter(x => x.name === meal.name.trim()).length > 0) {
      return { err: new Error('Meal name already exists') };
    }

    // check if price is a number
    if (meal.price && /[^0-9.]/gi.test(meal.price) === true) {
      return { err: new Error('Price is invalid') };
    }

    // check if price is less than one
    if (meal.price && meal.price <= 1) return { err: new Error('Price must be greater than 1') };

    // get meal record and update it
    const updateMeal = MealStore[meal.id - 1];
    updateMeal.name = meal.name || updateMeal.name;
    updateMeal.price = meal.price || updateMeal.price;
    updateMeal.image = meal.image || updateMeal.image;
    updateMeal.updatedAt = new Date();

    // save meal in db
    MealStore[meal.id - 1] = updateMeal;

    // return updated meal
    return updateMeal;
  }

  /**
   * static method to delete meal from meals using id
   * @param {*} id
   */
  static delete(id) {
    delete MealStore[id - 1];
  }

  /**
   * static method to get meal by meal id
   * @param {*} id
   * @returns {object|null} meal
   */
  static get(id) {
    if (Number.isInteger(id)) {
      return MealStore[id - 1];
    }
    return null;
  }

  /**
   * static method to get meal by meal name
   * @param {string} name
   * @returns {object|null} meal | null
   */
  static getByName(name) {
    const result = MealStore.filter(x => x.name === name);
    if (result.length > 0) {
      return result[0];
    }
    return null;
  }

  /**
   * get all meals in the meals table
   */
  static getAll() {
    return MealStore;
  }

  /**
   * truncate the meals table
   */
  static truncate() {
    MealStore.length = 0;
  }
}

export default Meals;
