import validator from 'validator';
import users from '../../db/users';
import BaseValidator from './baseValidator';

/**
 * User Middleware validators
 */

class user extends BaseValidator {
  /**
   * static method to check if email is valid
   * @param {object} request
   * @param {object} checkExists - specifies whether to check if email exists
   * @throws {object} Error message and status code
   */
  static async emailValid(request, checkExists = true) {
    try {
      // check if email is provided
      if (!request.body.email || !request.body.email.trim()) {
        this.throwError('Email is required', 400);
      }
      // check if email is valid
      if (!validator.isEmail(request.body.email.trim())) {
        this.throwError('Email is invalid', 400);
      }
      // check if email already exists
      const email = await users.getByEmail(request.body.email.trim());
      if (checkExists && email) {
        this.throwError('Email already exists. Try another one.', 409);
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * static method
   * checks if username was supplied
   * checks if username already exists
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static async usernameValid(request) {
    try {
      // check if username is provided
      if (!request.body.username || !request.body.username.trim()) {
        this.throwError('Username is required', 400);
      }
      // check if username already exists
      const username = await users.getByUsername(request.body.username.trim());
      if (username) {
        this.throwError('Username already exists. Try another one.', 409);
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * static method
   * checks if the password was provided
   * checks if password is above 6 characters
   * @param {object} request
   * @param {boolean} checkLength specifies whether to check password length or not
   * @throws {object} Error message and status code
   */
  static passwordValid(request, checkLength = true) {
    try {
      // check if password is provided
      if (!request.body.password || !request.body.password.trim()) {
        this.throwError('Password is required', 400);
      }
      // check if password is valid
      if (checkLength && request.body.password.trim().length <= 5) {
        this.throwError('Password must have atleast 6 characters', 400);
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * static method
   * checks if account type was provided
   * checks if account type is valid
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static accountValid(request) {
    try {
      // check if account type is provided
      if (!request.body.accountType || !request.body.accountType.trim()) {
        this.throwError('Account type is required', 400);
      }
      // check if account type is valid
      if (request.body.accountType.trim() !== 'customer' && request.body.accountType.trim() !== 'caterer') {
        this.throwError('Account type is invalid', 400);
      }
    } catch (e) {
      throw e;
    }
  }
}

export default user;
