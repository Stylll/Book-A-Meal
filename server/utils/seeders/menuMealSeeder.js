import MenuMeals from '../../db/menuMeals';

/**
 * This script contains template menu meal data to use for test.
 */
const validMenuMeal1 = {
  menuId: 2,
  mealId: 2,
};

const validMenuMeal2 = {
  menuId: 3,
  mealId: 3,
};

const invalidMenuMeal3 = {
  menuId: 0,
  mealId: 0,
};

const existingMenuMeal = {
  menuId: 1,
  mealId: 1,
};

/**
 * insert menumeal into menumeal table
 * @param {object} menuMeal
 */
const insertSeedMenuMeal = (menuMeal) => {
  MenuMeals.add(menuMeal);
};

/**
 * truncate menumeals table
 */
const clearMenuMeals = () => {
  MenuMeals.truncate();
};

export {
  validMenuMeal1,
  validMenuMeal2,
  invalidMenuMeal3,
  existingMenuMeal,
  insertSeedMenuMeal,
  clearMenuMeals,
};
