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
 * Router to handle user requests
 * @param {*} router router object from express
 * @returns {} response object
 */

const meals = (router) => {
  router.post(
    '/meals', upload.single('image'), validateAccount.user,
    validateAccount.caterer, validateMeal.post, MealController.post,
  );
};

export default meals;
