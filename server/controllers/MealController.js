import meals from '../db/meals';
import { defaultImage } from '../utils/seeders/mealSeeder';

/**
 * Controller Class to handle user meal requests
 */
class MealController {
  static post(req, res) {
    // add meal to db
    const meal = meals.add({
      name: req.body.name,
      price: req.body.price,
      image: (req.body.image) ? req.body.image : defaultImage,
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
