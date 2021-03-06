/**
 * Utils file for controller utils
 */

/**
 * Utility for processing meal ids for a menu
 * @param {object} menu
 * @param {array} newMealIds
 * @param {Number} userId
 * @returns {array} actualMealIds
 * It gets the difference between the oldMealIds in the menu
 * and the newMealIds and checks
 * if they belong to the user id passed in
 * before removing them from the actual meal Ids to return.
 */
const processMealIds = (menu, newMealIds, userId) => {
  const oldMealIds = [...menu.mealIds];
  // get the difference
  const diffIds = oldMealIds.filter(id => !newMealIds.includes(id));
  // loop to difference to check if meal is owned by user
  diffIds.forEach((id) => {
    const meal = menu.meals
      .find(mealItem => mealItem.id === id && mealItem.userId === userId);
    // remove meal from oldMealIds if its owned by the user
    if (meal) {
      oldMealIds.splice(oldMealIds.indexOf(id), 1);
    }
  });
  return oldMealIds.concat(newMealIds);
};

/* eslint-disable import/prefer-default-export */
export { processMealIds };
