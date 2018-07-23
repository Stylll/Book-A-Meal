import { isEmpty } from 'lodash';
import { Meals as MealModel } from '../models';


class Meals {
  /**
   * static method to add meal to the db
   * @param {object} meal
   * @returns {object} {added meal} | {err}
   */
  static add(meal) {
    // check if meal name is provided
    if (!meal.name.trim()) return { err: new Error('Meal name is required') };

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
    return MealModel.create(meal)
      .then((newMeal) => {
        if (newMeal) {
          return newMeal.dataValues;
        }
        return null;
      })
      .catch(error => ({ err: new Error(error.errors[0].message) }));
  }

  /**
   * static method to update meal
   * @param {object} meal
   * @return {object} {updated meal} | {err}
   */
  static update(meal) {
    // check if price is a number
    if (meal.price && /[^0-9.]/gi.test(meal.price) === true) {
      return { err: new Error('Price is invalid') };
    }

    // check if price is less than one
    if (meal.price && meal.price <= 1) return { err: new Error('Price must be greater than 1') };

    // get meal record and update it
    return MealModel.findById(meal.id)
      .then((returnedMeal) => {
        if (isEmpty(returnedMeal)) {
          return { err: new Error('Meal does not exist') };
        }
        return returnedMeal.update(meal)
          .then((updatedMeal) => {
            if (updatedMeal) {
              return updatedMeal.dataValues;
            }
            return null;
          })
          .catch(error => ({ err: new Error(error.errors[0].message) }));
      });
  }

  /**
   * static method to delete meal from meals using id
   * @param {integer} id
   */
  static delete(id) {
    return MealModel.findById(id)
      .then((returnedMeal) => {
        if (isEmpty(returnedMeal)) {
          return { err: new Error('Meal does not exist') };
        }
        return returnedMeal.destroy()
          .then(() => null)
          .catch(error => ({ err: new Error(error.errors[0].message) }));
      });
  }

  /**
   * static method to get meal by meal id
   * @param {integer} id
   * @returns {object|null} meal
   */
  static get(id) {
    return MealModel.findById(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['createdAt', 'DESC']],
    })
      .then((returnedMeal) => {
        if (isEmpty(returnedMeal)) {
          return undefined;
        }
        return returnedMeal.dataValues;
      })
      .catch(error => ({ err: error }));
  }

  /**
   * static method to get meal by meal name
   * @param {string} name
   * @returns {object|null} meal | null
   */
  static getByName(name) {
    return MealModel.findAll({
      where: {
        name,
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['createdAt', 'DESC']],
    })
      .then((returnedMeal) => {
        if (isEmpty(returnedMeal)) {
          return null;
        }
        return returnedMeal[0].dataValues;
      })
      .catch(error => ({ err: new Error(error.errors[0].message) }));
  }

  /**
   * get all meals in the meals table
   * @returns [array] meals
   */
  static getAll() {
    return MealModel.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['createdAt', 'DESC']],
    })
      .then((returnedMeal) => {
        if (isEmpty(returnedMeal)) {
          return [];
        }
        return returnedMeal;
      })
      .catch(error => ({ err: new Error(error.errors[0].message) }));
  }

  /**
   * get all meals using the user id
   * @param {integer} userId
   * @returns {array | null} [meals]
   */
  static getByUserId(userId) {
    return MealModel.findAll({
      where: {
        userId,
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['createdAt', 'DESC']],
    })
      .then((returnedMeal) => {
        if (isEmpty(returnedMeal)) {
          return [];
        }
        return returnedMeal;
      })
      .catch(error => ({ err: new Error(error.errors[0].message) }));
  }

  /**
   * truncate the meals table
   */
  static truncate() {
    return MealModel.sync({ force: true })
      .then(() => null);
  }
}

export default Meals;
