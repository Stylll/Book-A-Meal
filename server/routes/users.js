import UserController from '../controllers/UserController';
import validateUser from '../middlewares/users/validateUser';

/**
 * Router to handle user requests
 * @param {*} router router object from express
 * @returns {} response object
 */

const users = (router) => {
  router.post('/users/signup', validateUser.signup, UserController.signup);

  router.post('/users/signin', validateUser.signin, UserController.signin);
};

export default users;
