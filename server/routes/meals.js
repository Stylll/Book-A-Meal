import multer from 'multer';
import 'babel-polyfill';

import MealController from '../controllers/MealController';
import validateMeal from '../middlewares/meals/validateMeal';
import validateAccount from '../middlewares/users/validateAccount';

/**
 * Storage location for multer middleware
 */
const storage = multer.diskStorage({
  destination: 'server/temp/',
  filename: (req, file, callback) => {
    callback(null, Number(Date.now()) + file.originalname);
  },
});
// get function to enable multer capture uploaded images
const upload = multer({ storage });

/**
 * Router to handle meal requests
 * @param {object} router router object from express
 * @returns {object} meals router object
 */

const meals = (router) => {
  // meal router to handle post requests
  router.post(
    '/meals', upload.single('image'), validateAccount.user,
    validateAccount.caterer, validateMeal.post, MealController.post,
  );

  // meal router to handle pull requests
  router.put(
    '/meals/:id', upload.single('image'), validateAccount.user,
    validateAccount.caterer, validateMeal.put, MealController.put,
  );

  // meal router to handle get requests
  router.get('/meals', validateAccount.user, validateAccount.caterer, MealController.get);

  // meal router to handle delete requests
  router.delete(
    '/meals/:id', validateAccount.user, validateAccount.caterer,
    validateMeal.delete, MealController.delete,
  );
};

export default meals;
