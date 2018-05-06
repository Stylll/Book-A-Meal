import bcrypt from 'bcrypt';
import users from '../db/users';
import Authenticate from '../utils/authentication/authenticate';
/**
 * Controller Class to handle user authentication requests
 */
class UserController {
  /**
   * static method to handle user signup
   * @param {object} request
   * @param {object} response
   * @returns {object} {user, token, message} | {message}
   */
  static async signup(request, response) {
    // add user to db

    console.log('entering controller');
    const user = await users.add({
      email: request.body.email,
      username: request.body.username,
      password: request.body.password,
      accountType: request.body.accountType,
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

      return response.status(201).send({ user: newUser, token, message: 'Created successfully' });
    }
    return response.status(500).send({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle signin requests
   * @param {object} request
   * @param {object} response
   * @returns {object} {user, token, message} | {message}
   */
  static async signin(request, response) {
    // get user by email
    const user = await users.getByEmail(request.body.email);
    if (user) {
      // if user exists, then compare the passwords
      if (bcrypt.compareSync(request.body.password, user.password)) {
        // if password is correct, create the user instance to return without the password value
        const properUser = {
          id: user.id,
          email: user.email,
          username: user.username,
          accountType: user.accountType,
        };

        // get authentication token for user
        const token = Authenticate.authenticateUser(properUser);

        return response.status(200).send({ user: properUser, token, message: 'Login successful' });
      }
      return response.status(401).send({ message: 'Email or Password is incorrect' });
    }
    return response.status(401).send({ message: 'Email or Password is incorrect' });
  }
}

export default UserController;
