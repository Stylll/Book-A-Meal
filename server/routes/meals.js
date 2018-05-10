import multer from 'multer';
import 'babel-polyfill';

import MealController from '../controllers/MealController';
import validateAccount from '../middlewares/users/validateAccount';
import ValidateMeal from '../middlewares/meals/validateMeal';

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
    validateAccount.caterer, ValidateMeal.validateName, ValidateMeal.priceValid,
    ValidateMeal.nameExists, MealController.post,
  );

  // meal router to handle pull requests
  router.put(
    '/meals/:id', upload.single('image'), validateAccount.user,
    validateAccount.caterer, ValidateMeal.idExists, ValidateMeal.validateAccess,
    ValidateMeal.nameExists, ValidateMeal.priceValid, MealController.put,
  );

  // meal router to handle get requests
  router.get('/meals', validateAccount.user, validateAccount.caterer, MealController.get);

  // meal router to handle delete requests
  router.delete(
    '/meals/:id', validateAccount.user, validateAccount.caterer,
    ValidateMeal.idExists, ValidateMeal.validateAccess, MealController.delete,
  );
};

export default meals;
