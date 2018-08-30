import { isEmpty } from 'lodash';

/**
 * Middleware validator to validate query parameters
 */

class ValidateQuery {
  /**
   * validator to check query parameter limit if it's correct when provided
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {function} next
   */
  static async validateLimit(request, response, next) {
    if (request.query.limit) {
      const limit = parseInt(request.query.limit, 10);
      if (!Number.isInteger(limit) || limit < 0) {
        request.errors.limit = {
          message: 'Limit is invalid',
          statusCode: 400,
        };
      } else {
        request.query.limit = limit;
      }
    }

    return next();
  }

  /**
   * validator to check query parameter offset if it's correct when provided
   * @param {object} request
   * @param {object} response
   * @param {function} next
   * @returns {function} next
   */
  static async validateOffset(request, response, next) {
    if (request.query.offset) {
      const offset = parseInt(request.query.offset, 10);
      if (!Number.isInteger(offset) || offset < 0) {
        request.errors.offset = {
          message: 'Offset is invalid',
          statusCode: 400,
        };
      } else {
        request.query.offset = offset;
      }
    }

    return next();
  }
}

export default ValidateQuery;
