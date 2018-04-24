import meals from '../db/meals';
import { defaultImage } from '../utils/seeders/mealSeeder';
import CloudUpload from '../utils/cloudUpload';

/**
 * Controller Class to handle user meal requests
 */
class MealController {
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
}

export default MealController;
