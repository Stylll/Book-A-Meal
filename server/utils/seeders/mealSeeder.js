import Meals from '../../db/meals';

/**
 * template data store for meals
 */

const defaultImage = 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg';

const riceAndStew = {
  name: 'Rice and Stew',
  price: 3500,
  image: 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg',
  userId: 1,
};

const crispyChicken = {
  name: 'Crispy Chicken',
  price: 3500,
  image: 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg',
  userId: 1,
};

const invalidMeal = {
  name: '',
  price: 0,
  image: '',
};

const curryRice = {
  name: 'Curry Rice',
  price: 1000,
  image: 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg',
  userId: 1,
};

/**
 * inserts seed meal into database for testing
 * @param {object} meal
 */
const insertSeedMeal = async (meal) => {
  await Meals.add(meal);
};

/**
 * truncates the data in meals table
 */
const clearMeals = async () => {
  await Meals.truncate();
};

export {
  defaultImage,
  riceAndStew,
  crispyChicken,
  invalidMeal,
  curryRice,
  insertSeedMeal,
  clearMeals,
};
