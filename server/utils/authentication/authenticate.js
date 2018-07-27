import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

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
      email: user.email,
      accountType: user.accountType,
    };
    const token = jwt.sign(
      {
        user: payload,
      },
      process.env.SECRET,
      {
        expiresIn: Number(Date.now() + 5),
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
    } catch (err) {
      //
    }
    if (decoded) {
      return decoded;
    }
    return null;
  }
}

export default Authenticate;
