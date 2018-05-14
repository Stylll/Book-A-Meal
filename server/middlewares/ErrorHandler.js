import { isEmpty } from 'lodash';
/**
 * Middleware class to handle errors
 * set in the request body by the other middlewares.
 * Returns error object to the user
 */

class ErrorHandler {
  /**
   * static method to send error object with response status if error exists
   * @param {object} request
   * @param {object} response
   * @param {object} next
   * @returns {object|function} error object | next function
   */
  static handleErrors(request, response, next) {
    if (!isEmpty(request.errors)) {
      return response.status(400).json({ errors: request.errors });
    }
    return next();
  }
}

export default ErrorHandler;
