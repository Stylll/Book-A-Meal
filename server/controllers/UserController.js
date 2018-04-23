import users from '../db/users';
import Authenticate from '../utils/authentication/authenticate';
/**
 * Controller Class to handle user requests
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
      };

      // get jwt for user
      const token = Authenticate.authenticateUser(newUser);

      return res.status(201).send({ user: newUser, token });
    }
    return res.status(500).send({ message: 'Internal Server Error' });
  }
}

export default UserController;
