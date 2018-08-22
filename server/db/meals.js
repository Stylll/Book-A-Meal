import { isEmpty } from 'lodash';
import { Op, Sequelize } from 'sequelize';
import { Meals as MealModel } from '../models';
import paginator from '../utils/paginator';


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
    if (meal.price <= 1) {
      return { err: new Error('Price must be greater than 1') };
    }

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
    if (meal.price && meal.price <= 1) {
      return { err: new Error('Price must be greater than 1') };
    }

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
   * @param {bool} paranoid default = true
   * @returns {object|null} meal
   */
  static get(id, paranoid = true) {
    return MealModel.findById(id, {
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      order: [['createdAt', 'DESC']],
      paranoid,
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
   * @param {bool} paranoid default = true
   * @returns {object|null} meal | null
   */
  static getByName(name, paranoid = true, limit = 10, offset = 0) {
    return MealModel.findAndCountAll({
      where: Sequelize
        .where(
          Sequelize.fn('lower', Sequelize.col('name')),
          Sequelize.fn('lower', name),
        ),
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      order: [['createdAt', 'DESC']],
      paranoid,
      limit,
      offset,
    })
      .then((returnedMeal) => {
        if (isEmpty(returnedMeal)) {
          return {
            meals: [],
            pagination: paginator(limit, offset, 0),
          };
        }
        return {
          meals: returnedMeal.rows,
          pagination: paginator(limit, offset, returnedMeal.count),
        };
      })
      .catch(error => ({ err: new Error(error.errors[0].message) }));
  }

  /**
   * get all meals in the meals table
   * @param {bool} paranoid default = true
   * @returns [array] meals
   */
  static getAll(paranoid = true, limit = 10, offset = 0, mealName = '') {
    return MealModel.findAndCountAll({
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      order: [['createdAt', 'DESC']],
      paranoid,
      limit,
      offset,
      where: {
        name: Sequelize
          .where(Sequelize.fn(
            'LOWER',
            Sequelize.col('name'),
          ), 'LIKE', `%${mealName.toLowerCase()}%`),
      },
    })
      .then((returnedMeal) => {
        if (isEmpty(returnedMeal)) {
          return {
            meals: [],
            pagination: paginator(limit, offset, 0),
          };
        }
        return {
          meals: returnedMeal.rows,
          pagination: paginator(limit, offset, returnedMeal.count),
        };
      })
      .catch(error => ({ err: new Error(error.errors[0].message) }));
  }

  /**
   * get all meals using the user id
   * @param {integer} userId
   * @param {bool} paranoid default = true
   * @returns {array | null} [meals]
   */
  static getByUserId(userId, paranoid = true, limit = 10, offset = 0, mealName = '') {
    return MealModel.findAndCountAll({
      where: {
        userId,
        name: Sequelize
          .where(Sequelize.fn(
            'LOWER',
            Sequelize.col('name'),
          ), 'LIKE', `%${mealName.toLowerCase()}%`),
      },
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
      order: [['createdAt', 'DESC']],
      paranoid,
      limit,
      offset,
    })
      .then((returnedMeal) => {
        if (isEmpty(returnedMeal)) {
          return {
            meals: [],
            pagination: paginator(limit, offset, 0),
          };
        }
        return {
          meals: returnedMeal.rows,
          pagination: paginator(limit, offset, returnedMeal.count),
        };
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
