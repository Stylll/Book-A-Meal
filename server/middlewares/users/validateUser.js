import validator from 'validator';
import users from '../../db/users';

/**
 * User Middleware validators
 */

class ValidateUser {
  /**
   * static method to check if email is valid
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @throws {function} next
   */
  static async emailValid(request, response, next) {
    // check if email is provided
    if (!request.body.email || !request.body.email.trim()) {
      request.errors.email = {
        message: 'Email is required',
        statusCode: 400,
      };
      return next();
    }
    // check if email is valid
    if (!validator.isEmail(request.body.email.trim())) {
      request.errors.email = {
        message: 'Email is invalid',
        statusCode: 400,
      };
      return next();
    }
    // check if email already exists
    const email = await users.getByEmail(request.body.email.trim());
    if (email) {
      request.errors.email = {
        message: 'Email already exists. Try another one.',
        statusCode: 409,
      };
      return next();
    }
    return next();
  }

  /**
   * static method to check if email is passed when logging in
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @throws {function} next
   */
  static async emailLoginValid(request, response, next) {
    // check if email is provided
    if (!request.body.email || !request.body.email.trim()) {
      request.errors.email = {
        message: 'Email is required',
        statusCode: 400,
      };
      return next();
    }
    // check if email is valid
    if (!validator.isEmail(request.body.email.trim())) {
      request.errors.email = {
        message: 'Email is invalid',
        statusCode: 400,
      };
      return next();
    }
    return next();
  }

  /**
   * static method to validate email when user wants to reset password
   * adds any error to the error object present in the request object
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @returns {function} next
   */
  static async forgotPasswordValid(request, response, next) {
    // check if email is provided
    if (!request.body.email || !request.body.email.trim()) {
      request.errors.email = {
        message: 'Email is required',
        statusCode: 400,
      };
      return next();
    }
    // check if email is valid
    if (!validator.isEmail(request.body.email.trim())) {
      request.errors.email = {
        message: 'Email is invalid',
        statusCode: 400,
      };
      return next();
    }
    // check if email already exists
    const email = await users.getByEmail(request.body.email.trim());
    if (!email) {
      request.errors.email = {
        message: 'Email does not exist',
        statusCode: 400,
      };
      return next();
    }
    return next();
  }

  /**
   * static method
   * checks if username was supplied
   * checks if username already exists
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @throws {function} next
   */
  static async usernameValid(request, response, next) {
    // check if username is provided
    if (!request.body.username || !request.body.username.trim()) {
      request.errors.username = {
        message: 'Username is required',
        statusCode: 400,
      };
      return next();
    }
    // check if username already exists
    const username = await users.getByUsername(request.body.username.trim());
    if (username) {
      request.errors.username = {
        message: 'Username already exists. Try another one.',
        statusCode: 409,
      };
      return next();
    }
    return next();
  }

  /**
   * static method
   * checks if the password was provided
   * checks if password is above 6 characters
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @throws {function} next
   */
  static passwordValid(request, response, next) {
    // check if password is provided
    if (!request.body.password || !request.body.password.trim()) {
      request.errors.password = {
        message: 'Password is required',
        statusCode: 400,
      };
      return next();
    }
    // check if password is valid
    if (request.body.password.trim().length <= 5) {
      request.errors.password = {
        message: 'Password must have atleast 6 characters',
        statusCode: 400,
      };
      return next();
    }
    return next();
  }

  /**
   * static method
   * checks if the password was provided
   * adds error message to the request error object
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @throws {function} next
   */
  static passwordLoginValid(request, response, next) {
    // check if password is provided
    if (!request.body.password || !request.body.password.trim()) {
      request.errors.password = {
        message: 'Password is required',
        statusCode: 400,
      };
      return next();
    }
    return next();
  }

  /**
   * static method
   * checks if account type was provided
   * checks if account type is valid
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @throws {function} next
   */
  static accountValid(request, response, next) {
    // check if account type is provided
    if (!request.body.accountType || !request.body.accountType.trim()) {
      request.errors.accountType = {
        message: 'Account type is required',
        statusCode: 400,
      };
      return next();
    }
    // check if account type is valid
    if (request.body.accountType.trim() !== 'customer' && request.body.accountType.trim() !== 'caterer') {
      request.errors.accountType = {
        message: 'Account type is invalid',
        statusCode: 400,
      };
      return next();
    }
    return next();
  }
}

export default ValidateUser;
