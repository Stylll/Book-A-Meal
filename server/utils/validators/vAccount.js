import BaseValidator from './baseValidator';
import Authenticate from '../../utils/authentication/authenticate';

/**
 * Account Middleware validators
 */

class account extends BaseValidator {
  /**
   * static method to get token from request header
   * verify access token
   * and decoded token to request object
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static tokenValid(request) {
    const token = request.body.token || request.query.token
      || request.headers['x-access-token'];
    if (!token) {
      this.throwError('Authentication failed. No token provided', 401);
    }
    const decoded = Authenticate.verifyToken(token);
    if (!decoded) {
      this.throwError('Token is invalid or has expired', 401);
    } else {
      // put the decoded user object in the request
      request.decoded = decoded;
    }
  }

  /**
   * static method to validate if a user account type is caterer or an admin
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static catererAdminValid(request) {
    const { decoded } = request;
    if ((decoded && decoded.user && decoded.user.accountType === 'caterer') ||
    (decoded && decoded.user && decoded.user.accountType === 'admin')) {
      // nothing
    } else {
      this.throwError('Unauthorized Access', 403);
    }
  }

  /**
   * static method to validate user account type is customer
   * @param {object} request
   * @throws {object} Error message and status code
   */
  static customerValid(request) {
    const { decoded } = request;
    if (decoded && decoded.user && decoded.user.accountType === 'customer') {
      // do nothing
    } else {
      this.throwError('Unauthorized Access', 403);
    }
  }
}

export default account;
