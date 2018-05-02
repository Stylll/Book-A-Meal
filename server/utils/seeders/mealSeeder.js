import Meals from '../../db/meals';

const defaultImage = 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg';

const validMeal1 = {
  name: 'Rice and Stew',
  price: 3500,
  image: 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg',
  userId: 1,
};

const validMeal2 = {
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

const existingMeal = {
  name: 'Curry Rice',
  price: 1000,
  image: 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg',
  userId: 1,
};

/**
 * inserts seed meal into database for testing
 */
const insertSeedMeal = (meal) => {
  Meals.add(meal);
};

/**
 * truncates the data in meals table
 */
const clearMeals = () => {
  Meals.truncate();
};

export {
  defaultImage,
  validMeal1,
  validMeal2,
  invalidMeal,
  existingMeal,
  insertSeedMeal,
  clearMeals,
};
