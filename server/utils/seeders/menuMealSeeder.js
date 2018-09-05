import MenuMeals from '../../db/menuMeals';

/**
 * This script contains template menu meal data to use for test.
 */
const menuWithSecondMeal = {
  menuId: 2,
  mealId: 2,
};

const menuWithThirdMeal = {
  menuId: 3,
  mealId: 3,
};

const invalidMenuMeal3 = {
  menuId: 0,
  mealId: 0,
};

const menuWithFirstMeal = {
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
  menuWithSecondMeal,
  menuWithThirdMeal,
  invalidMenuMeal3,
  menuWithFirstMeal,
  insertSeedMenuMeal,
  clearMenuMeals,
};
