import bcrypt from 'bcrypt';
import randomstring from 'randomstring';
import users from '../db/users';
import Authenticate from '../utils/authentication/authenticate';
import { transporter, mailOptions, forgotPasswordMail } from '../utils/mailer/NodeMailer';
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

  /**
   * Static method to handle forgotpassword requests.
   * @param {object} request
   * @param {object} response
   * @returns {object} {user, token, message} | {message}
   * Updates user profile with reset token.
   * Sends reset token to user's email.
   */
  static async forgotpassword(request, response) {
    // get user by email
    const user = await users.getByEmail(request.body.email);
    if (user) {
      const resetToken = randomstring.generate(30);
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 360000;
      const result = await users.update(user);
      if (result && result.id === user.id) {
        const to = user.email;
        const subject = 'Book-A-Meal Password Reset';
        return transporter.sendMail(mailOptions(
          to,
          subject,
          forgotPasswordMail(request.headers.host, user.username, resetToken),
        ))
          .then(() => response.status(200).json({ message: 'A reset link has been sent to your email' }))
          .catch(() => response.status(500).json({ message: 'Sorry. An error occurred. Please try again.' }));
      }
    }
    return response.status(500).json({ message: 'An error occurred' });
  }
}

export default UserController;
