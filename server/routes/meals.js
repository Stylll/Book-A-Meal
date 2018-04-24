import MealController from '../controllers/MealController';
import validateMeal from '../middlewares/meals/validateMeal';
import validateAccount from '../middlewares/users/validateAccount';

/**
 * Router to handle user requests
 * @param {*} router router object from express
 * @returns {} response object
 */

const meals = (router) => {
  router.post('/meals', validateAccount.user, validateAccount.caterer, validateMeal.post, MealController.post);
};

export default meals;
