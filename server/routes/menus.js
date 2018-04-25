import MenuController from '../controllers/MenuController';
import validateAccount from '../middlewares/users/validateAccount';
import validateMenu from '../middlewares/menus/validateMenu';

/**
 * Router to handle menu requests
 * @param {*} router router object from express
 * @returns {} response object
 */

const menus = (router) => {
  // router to handle menu post request
  router.post('/menu', validateAccount.user, validateAccount.caterer, MenuController.post);

  // router to handle meal post request
  router.post(
    '/menu/:id/meals', validateAccount.user,
    validateAccount.caterer, validateMenu.postMeal, MenuController.postMeal,
  );
};

export default menus;
