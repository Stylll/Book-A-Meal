import validator from 'validator';
import users from '../../db/users';

/**
 * Middleware class to validate user actions
 */
class validateUser {
  /**
   * static method to validate a signup request body
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static signup(req, res, next) {
    // check if email is provided
    if (!req.body.email.trim()) {
      return res.status(400).send({ message: 'Email is required' });
    }

    // check if email is valid
    if (!validator.isEmail(req.body.email.trim())) {
      return res.status(400).send({ message: 'Email is invalid' });
    }

    // check if email already exists
    if (users.getByEmail(req.body.email.trim())) {
      return res.status(409).send({ message: 'Email already exists. Try another one.' });
    }

    // check if username is provided
    if (!req.body.username.trim()) {
      return res.status(400).send({ message: 'Username is required' });
    }

    // check if username already exists
    if (users.getByUsername(req.body.username.trim())) {
      return res.status(409).send({ message: 'Username already exists. Try another one.' });
    }

    // check if password is provided
    if (!req.body.password.trim()) {
      return res.status(400).send({ message: 'Password is required' });
    }

    // check if password is valid
    if (req.body.password.trim().length <= 5) {
      return res.status(400).send({ message: 'Password must have atleast 5 characters' });
    }

    // check if account type is provided
    if (!req.body.accountType.trim()) {
      return res.status(400).send({ message: 'Account type is required' });
    }

    // check if account type is valid
    if (req.body.accountType.trim() !== 'customer' && req.body.accountType.trim() !== 'caterer') {
      return res.status(400).send({ message: 'Account type is invalid' });
    }

    // all checks passes, then call the next function
    return next();
  }

  /**
   * static method to validate a signin request body
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static signin(req, res, next) {
    // check if email is provided
    if (!req.body.email.trim()) {
      return res.status(400).send({ message: 'Email is required' });
    }

    // check if email is valid
    if (!validator.isEmail(req.body.email.trim())) {
      return res.status(400).send({ message: 'Email is invalid' });
    }

    // check if password is provided
    if (!req.body.password.trim()) {
      return res.status(400).send({ message: 'Password is required' });
    }

    return next();
  }
}

export default validateUser;
