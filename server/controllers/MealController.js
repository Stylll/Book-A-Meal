import meals from '../db/meals';
import { defaultImage } from '../utils/seeders/mealSeeder';
import CloudUpload from '../utils/cloudUpload';

/**
 * Controller Class to handle user meal requests
 */
class MealController {
  /**
   * static method to handle meal post request.
   * creates meal.
   * @param {*} req
   * @param {*} res
   */
  static async post(req, res) {
    let image = defaultImage;

    // upload image to cloudinary and get image link if image was passed
    if (req.image && req.image.path) {
      const result = await CloudUpload.uploadImage(req.image);
      if (result && result.secure_url) {
        image = result.secure_url;
      }
    }

    // add meal to db
    const meal = meals.add({
      name: req.body.name,
      price: req.body.price,
      image,
      userId: req.decoded.user.id,
    });
    // if meal exists and there's no error object in it
    if (meal && !meal.err) {
      // return new meal if save was successful
      return res.status(201).send({ meal });
    }
    return res.status(500).send({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle meal put requests
   * updates meal using meal id
   * @param {*} req
   * @param {*} res
   */
  static async put(req, res) {
    // get meal from the db
    const oldMeal = meals.get(req.params.id);
    if (oldMeal) {
      let { image } = oldMeal;

      // upload image to cloudinary and get image link if image was passed
      if (req.image && req.image.path) {
        const result = await CloudUpload.uploadImage(req.image);
        if (result && result.secure_url) {
          image = result.secure_url;
        }
      }

      // update oldMeal with new data if exists
      oldMeal.name = req.body.name || oldMeal.name;
      oldMeal.price = req.body.price || oldMeal.price;
      oldMeal.image = image;

      // save updated data
      const updatedMeal = meals.update(oldMeal);

      if (updatedMeal && !updatedMeal.err) {
        return res.status(200).send({ meal: updatedMeal });
      }
      return res.status(500).send({ message: 'Internal Server Error' });
    }
    return res.status(404).send({ message: 'Meal does not exist' });
  }
}

export default MealController;
