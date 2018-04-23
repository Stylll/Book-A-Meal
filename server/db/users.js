import bcrypt from 'bcrypt';

import generateId from '../utils/generateId';


// variable to store the user records.
const UserStore = [];

class Users {
  /**
   * static method to add user to the db
   * @param {object} user
   * @returns {object} newly added user
   */
  static add(user) {
    const newUser = user;
    newUser.password = bcrypt.hashSync(newUser.password, 10); // hash user password
    newUser.id = generateId(UserStore);
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();
    UserStore.push(newUser);

    return newUser;
  }

  /**
   * static method to add bulk users to the db
   * @param {array} userArray
   *
   */
  static addBulk(userArray) {
    userArray.foreach((user) => {
      this.add(user);
    });
  }

  /**
   * static method to update user using user id
   * @param {object} user
   * @return {object} updated user
   */
  static update(user) {
    const updateUser = user;
    updateUser.password = bcrypt.hashSync(updateUser.password, 10); // hash user password
    updateUser.updatedAt = new Date();

    // if user exists in the db
    if (UserStore[updateUser.id - 1]) {
      UserStore[updateUser.id - 1] = updateUser;
      return updateUser;
    }
    // else return null
    return null;
  }

  /**
   * static method to delete user from db
   * @param {Integer} id
   */
  static delete(id) {
    delete UserStore[id - 1];
  }

  /**
   * static method to get user by user id
   * @param {Integer} id
   * @returns {object} user
   */
  static get(id) {
    return UserStore[id - 1];
  }

  /**
   * static method to get user by user email
   * @param {integer} email
   * @returns {object|null} user
   */
  static getByEmail(email) {
    const result = UserStore.filter(x => x.email === email);
    if (result.length > 0) {
      return result[0];
    }
    return null;
  }

  /**
   * static method to get user by username
   * @param {string} username
   * @return {object|null} user
   */
  static getByUsername(username) {
    const result = UserStore.filter(x => x.username === username);
    if (result.length > 0) {
      return result[0];
    }
    return null;
  }

  /**
   * static method to get all users in the db
   */
  static getAll() {
    return UserStore;
  }

  /**
   * truncate data in UserStore array.
   */
  static truncate() {
    UserStore.length = 0;
  }
}

export default Users;
