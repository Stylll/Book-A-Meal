import bcrypt from 'bcrypt';
import users from '../db/users';
import Authenticate from '../utils/authentication/authenticate';
/**
 * Controller Class to handle user authentication requests
 */
class UserController {
  /**
   * static method to handle user signup
   * @param {*} req
   * @param {*} res
   */
  static signup(req, res) {
    // add user to db
    const user = users.add({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      accountType: req.body.accountType,
    });
    // check if it was successful
    if (user) {
      // get user details except password
      const newUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        accountType: user.accountType,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      // get jwt for user
      const token = Authenticate.authenticateUser(newUser);

      return res.status(201).send({ user: newUser, token });
    }
    return res.status(500).send({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle signin requests
   * @param {*} req
   * @param {*} res
   */
  static signin(req, res) {
    // get user by email
    const user = users.getByEmail(req.body.email);
    if (user) {
      // if user exists, then compare the passwords
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // if password is correct, create the user instance to return without the password value
        const properUser = {
          id: user.id,
          email: user.email,
          username: user.username,
          accountType: user.accountType,
        };

        // get authentication token for user
        const token = Authenticate.authenticateUser(properUser);

        return res.status(200).send({ user: properUser, token });
      }
      return res.status(401).send({ message: 'Email or Password is incorrect' });
    }
    return res.status(401).send({ message: 'Email or Password is incorrect' });
  }
}

export default UserController;
