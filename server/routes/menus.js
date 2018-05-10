import MenuController from '../controllers/MenuController';
import validateAccount from '../middlewares/users/validateAccount';
import ValidateMenu from '../middlewares/menus/validateMenu';

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
    ValidateMenu.validateMealOwner, MenuController.post,
  );

  // router to handle meal post request
  router.put(
    '/menu/:id', validateAccount.user,
    validateAccount.caterer, ValidateMenu.menuValid, ValidateMenu.idExists,
    ValidateMenu.mealsValid, MenuController.put,
  );

  // router to handle menu get request
  router.get('/menu', validateAccount.user, MenuController.get);
};

export default menus;
