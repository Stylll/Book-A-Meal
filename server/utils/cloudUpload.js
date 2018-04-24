import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

class CloudUpload {
  /**
   * Method to upload image file to cloudinary
   * @param {*} src
   * @returns {Promise} promise
   */
  static uploadImageToCloud(src) {
    const resp = new Promise(async (resolve, reject) => {
      await cloudinary.v2.uploader.upload(src, (err, res) => {
        if (!err) {
          resolve(res.secure_url);
        }
        reject(err);
      });
    });
    return resp;
  }

  /**
   * Method to validate image link and upload image
   * @param {*} src
   * @returns {Promise}
   */
  static uploadImage(src) {
    if (!src.trim()) return 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg'; // default image
    const result = CloudUpload.uploadImageToCloud(src).then(res => res).catch(error => error);

    return result;
  }
}

export default CloudUpload;
