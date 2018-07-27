import MenuController from '../controllers/MenuController';
import validateAccount from '../middlewares/users/validateAccount';
import ValidateMenu from '../middlewares/menus/validateMenu';
import ValidateQuery from '../middlewares/validateQuery';
import ErrorHandler from '../middlewares/ErrorHandler';
import AsyncWrapper from '../utils/AsyncWrapper';

/**
 * Router to handle menu requests
 * @param {object} router router object from express
 * @returns {object} menus router object
 */

const menus = (router) => {
  // router to handle menu post request
  router.post(
    '/menu', validateAccount.user, validateAccount.caterer,
    ValidateMenu.existsForDay, ValidateMenu.mealsValid,
    ValidateMenu.mealExists, ValidateMenu.validateMealOwner,
    ErrorHandler.handleErrors, AsyncWrapper(MenuController.post),
  );

  // router to handle meal post request
  router.put(
    '/menu/:id', validateAccount.user,
    validateAccount.caterer, ValidateMenu.menuValid, ValidateMenu.idExists,
    ValidateMenu.mealsValid, ValidateMenu.mealExists,
    ValidateMenu.validateMealOwner, ErrorHandler.handleErrors,
    AsyncWrapper(MenuController.put),
  );

  // router to handle menu get request
  router.get(
    '/menu', validateAccount.user, ValidateQuery.validateLimit,
    ValidateQuery.validateOffset, ErrorHandler.handleErrors,
    AsyncWrapper(MenuController.get),
  );

  router.get(
    '/menu/:id', validateAccount.user, validateAccount.caterer,
    ValidateQuery.validateLimit, ValidateQuery.validateOffset,
    ErrorHandler.handleErrors, AsyncWrapper(MenuController.getMenuWithMeals),
  );
};

export default menus;
