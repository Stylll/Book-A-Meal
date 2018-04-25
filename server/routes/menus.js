import MenuController from '../controllers/MenuController';
import validateAccount from '../middlewares/users/validateAccount';

/**
 * Router to handle menu requests
 * @param {*} router router object from express
 * @returns {} response object
 */

const menus = (router) => {
  // router to handle menu post request
  router.post('/menu', validateAccount.user, validateAccount.caterer, MenuController.post);
};

export default menus;
