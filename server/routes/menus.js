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
  router.post('/menu', validateAccount.user, validateAccount.caterer, validateMenu.post, MenuController.post);

  // router to handle meal post request
  router.put(
    '/menu/:id', validateAccount.user,
    validateAccount.caterer, validateMenu.put, MenuController.put,
  );

  // router to handle menu get request
  router.get('/menu', validateAccount.user, MenuController.get);
};

export default menus;
