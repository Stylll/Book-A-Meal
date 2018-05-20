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
   * @param {object} request
   * @param {object} response
   * @returns {object} {meal, message} | {message}
   */
  static async post(request, response) {
    let image = defaultImage;
    // upload image to cloudinary and get image link if image was passed
    if (request.file && request.file.path) {
      const result = await CloudUpload.uploadImage(request.file.path);
      if (result) {
        image = result;
      }
    }

    // add meal to db
    const meal = await meals.add({
      name: request.body.name.trim(),
      price: request.body.price,
      image,
      userId: request.decoded.user.id,
    });
    // if meal exists and there's no error object in it
    if (meal && !meal.err) {
      // return new meal if save was successful
      return response.status(201).send({ meal, message: 'Created successfully' });
    }
    return response.status(500).send({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle meal put requests
   * updates meal using meal id
   * @param {object} request
   * @param {object} response
   * @returns {object} {meal, message} | {message}
   */
  static async put(request, response) {
    // get meal from the db
    const oldMeal = await meals.get(parseInt(request.params.id, 10));
    if (oldMeal) {
      let { image } = oldMeal;

      // upload image to cloudinary and get image link if image was passed
      if (request.file && request.file.path) {
        const result = await CloudUpload.uploadImage(request.file.path);
        if (result) {
          image = result;
        }
      }

      // update oldMeal with new data if exists
      oldMeal.name = (request.body.name && request.body.name.trim())
        ? request.body.name.trim() : null;
      oldMeal.price = request.body.price || oldMeal.price;
      oldMeal.image = image;

      // save updated data
      const updatedMeal = await meals.update(oldMeal);

      if (updatedMeal && !updatedMeal.err) {
        return response.status(200).send({ meal: updatedMeal, message: 'Updated successfully' });
      }
      return response.status(500).send({ message: 'Internal Server Error' });
    }
    return response.status(404).send({ message: 'Meal does not exist' });
  }

  /**
   * static method to handle meal get request
   * @param {object} request
   * @param {object} response
   * @returns {object} {meals} | {message}
   */
  static async get(request, response) {
    if (request.decoded.user.accountType === 'admin') {
      const mealArray = await meals.getAll();
      return response.status(200).send({ meals: mealArray });
    }
    const mealArray = await meals.getByUserId(request.decoded.user.id);
    return response.status(200).send({ meals: mealArray });
  }

  /**
   * static method to handle meal delete request
   * @param {object} request
   * @param {object} response
   * @returns {object} {message}
   */
  static async delete(request, response) {
    await meals.delete(parseInt(request.params.id, 10));

    return response.status(200).send({ message: 'Meal deleted successfully' });
  }
}

export default MealController;
