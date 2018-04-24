import Authenticate from '../../utils/authentication/authenticate';
/**
 * Middleware Class to validate user account.
 * Validates general user
 * Validates caterer
 * Validates customer
 *
 */

class ValidateAccount {
  /**
   * static method to get token from request header
   * verify access token
   * and decoded token to request object
   * @param {*} req
   * @param {*} res
   */
  static user(req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      const decoded = Authenticate.verifyToken(token);
      if (decoded) {
        req.decoded = decoded;
        return next();
      }
      return res.status(401).send({ message: 'Token is invalid or has expired' });
    }
    return res.status(401).send({ message: 'Authentication failed. No token provided' });
  }

  /**
   * static method to verify if a user is a caterer,
   * using decoded object from the request object
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static caterer(req, res, next) {
    const { decoded } = req;
    if (decoded && decoded.user && decoded.user.accountType === 'caterer') {
      return next();
    }
    return res.status(401).send({ message: 'Unauthorized Access' });
  }

  /**
   * static method to verify if a user is a customer,
   * using decoded object from the request object
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static customer(req, res, next) {
    const { decoded } = req;
    if (decoded && decoded.user && decoded.user.accountType === 'customer') {
      return next();
    }
    return res.status(401).send({ message: 'Unauthorized Access' });
  }
}

export default ValidateAccount;
