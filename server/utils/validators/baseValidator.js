/**
 * Base validator class
 * Contains general methods used by validator classes
 */
class BaseValidator {
  /**
   * static method
   * throw error message and status code to express error handler
   * @param {string} message
   * @param {integer} statusCode
   * @throws {object} Error message and status code
   */
  static throwError(message, statusCode) {
    const err = new Error(message);
    err.status = statusCode;
    throw err;
  }
}

export default BaseValidator;
