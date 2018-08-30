import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from '../../../config/logger';

dotenv.config();
/**
 * Class to handle user authentication with jsonwebtoken
 */
class Authenticate {
  /**
   * Generates jwt for user
   * @param {object} user
   * @returns {object} jwt
   */
  static authenticateUser(user) {
    const payload = {
      id: user.id,
      username: user.username,
      accountType: user.accountType,
    };
    const token = jwt.sign(
      {
        user: payload,
      },
      process.env.SECRET,
      {
        expiresIn: '24h',
      },
    );
    return token;
  }

  /**
   * Static method to verify and decode jwt
   * @param {string} token
   * @returns {object} decoded
   */
  static verifyToken(token) {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET);
    } catch (error) {
      logger.error(error);
      return null;
    }
    return decoded;
  }
}

export default Authenticate;
