import { isEmpty } from 'lodash';
import { Users as UserModel } from '../models';

class Users {
  /**
   * static method to add user to the db
   * @param {object} user
   * @returns {object} newly added user | {err}
   */
  static async add(user) {
    return UserModel.create(user)
      .then((newUser) => {
        if (newUser) {
          return newUser.dataValues;
        }
        return null;
      })
      .catch(error => ({ err: new Error(error.errors[0].message) }));
  }

  /**
   * static method to update user using user id
   * @param {object} user
   * @return {object} updated user | {err}
   */
  static update(user) {
    return UserModel.findById(user.id)
      .then((returnedUser) => {
        if (isEmpty(returnedUser)) {
          return { err: new Error('User does not exist') };
        }
        return returnedUser.update(user)
          .then((updatedUser) => {
            if (updatedUser) {
              return updatedUser.dataValues;
            }
            return null;
          })
          .catch(error => ({ err: new Error(error.errors[0].message) }));
      });
  }

  /**
   * static method to delete user from db
   * @param {Integer} id
   */
  static delete(id) {
    return UserModel.findById(id)
      .then((returnedUser) => {
        if (isEmpty(returnedUser)) {
          return { err: new Error('User does not exist') };
        }
        return returnedUser.destroy()
          .then(() => null)
          .catch(error => ({ err: new Error(error.errors[0].message) }));
      });
  }

  /**
   * static method to get user by user id
   * @param {Integer} id
   * @returns {object|undefined} user
   */
  static get(id) {
    return UserModel.findById(id)
      .then((returnedUser) => {
        if (isEmpty(returnedUser)) {
          return undefined;
        }
        return returnedUser.dataValues;
      })
      .catch(error => ({ err: new Error(error.errors[0].message) }));
  }

  /**
   * static method to get user by user email
   * @param {integer} email
   * @returns {object|null} user
   */
  static getByEmail(email) {
    return UserModel.findAll({
      where: {
        email,
      },
    })
      .then((returnedUser) => {
        if (isEmpty(returnedUser)) {
          return null;
        }
        return returnedUser[0].dataValues;
      })
      .catch(error => ({ err: new Error(error.errors[0].message) }));
  }

  /**
   * static method to get user by username
   * @param {string} username
   * @return {object|null} user
   */
  static getByUsername(username) {
    return UserModel.findAll({
      where: {
        username,
      },
    })
      .then((returnedUser) => {
        if (isEmpty(returnedUser)) {
          return null;
        }
        return returnedUser[0].dataValues;
      })
      .catch(error => ({ err: new Error(error.errors[0].message) }));
  }

  /**
   * static method to get all users in the db
   * @returns {array} users
   */
  static getAll() {
    return UserModel.findAll()
      .then((returnedUser) => {
        if (isEmpty(returnedUser)) {
          return null;
        }
        return returnedUser;
      })
      .catch(error => ({ err: new Error(error.errors[0].message) }));
  }

  /**
   * truncate data in UserStore array.
   */
  static truncate() {
    return UserModel.sync({ force: true })
      .then(() => null);
  }
}

export default Users;
