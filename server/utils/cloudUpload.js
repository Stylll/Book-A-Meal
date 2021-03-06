import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import { defaultImage } from '../utils/seeders/mealSeeder';

dotenv.config();


class CloudUpload {
  /**
   * Method to upload image file to cloudinary
   * @param {string|file} source
   * @returns {Promise} promise
   */
  static uploadImageToCloud(source) {
    const promise = new Promise(async (resolve, reject) => {
      await cloudinary.v2.uploader.upload(source, (error, response) => {
        if (!error) {
          resolve(response.secure_url);
        }
        reject(error);
      });
    });
    return promise;
  }

  /**
   * Method to validate image link and upload image
   * @param {string|file} source
   * @returns {Promise}
   */
  static uploadImage(source) {
    if (!source || !source.trim()) return defaultImage;
    const result = this.uploadImageToCloud(source)
      .then(response => response).catch(error => error);
    return result;
  }
}

export default CloudUpload;
