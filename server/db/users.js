import bcrypt from 'bcrypt';
import validator from 'validator';
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
    // if user email is not provided
    if (!user.email.trim()) return { err: new Error('Email is required') };

    // if user email is not valid
    if (!validator.isEmail(user.email.trim())) return { err: new Error('Email is invalid') };

    // if user email exists
    if (UserStore.filter(x => x.email === user.email.trim()).length > 0) return { err: new Error('Email exists') };

    // if username is not provided
    if (!user.username.trim()) return { err: new Error('Username is required') };

    // if username exists
    if (UserStore.filter(x => x.username === user.username.trim()).length > 0) {
      return { err: new Error('Username exists') };
    }

    // if password is not provided
    if (!user.password.trim()) return { err: new Error('Password is required') };

    // if password is invalid
    if (user.password.trim().length <= 5) return { err: new Error('Password must have atleast 5 characters') };

    // add the user to the db
    const newUser = { ...user };
    newUser.password = bcrypt.hashSync(newUser.password, 10); // hash user password
    newUser.id = generateId(UserStore);
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();
    newUser.accountType = newUser.accountType || 'customer';
    UserStore.push(newUser);

    return newUser;
  }

  /**
   * static method to add bulk users to the db
   * @param {array} userArray
   *
   */
  static addBulk(userArray) {
    userArray.forEach((user) => {
      this.add(user);
    });
  }

  /**
   * static method to update user using user id
   * @param {object} user
   * @return {object} updated user
   */
  static update(user) {
    // if password is not provided
    if (!user.password.trim()) return { err: new Error('Password is required') };

    // if password is invalid
    if (user.password.trim().length <= 5) return { err: new Error('Password must have atleast 5 characters') };

    // if user exists in the db
    if (UserStore[user.id - 1]) {
      const updateUser = UserStore[user.id - 1];
      updateUser.password = bcrypt.hashSync(updateUser.password, 10); // hash user password
      updateUser.updatedAt = new Date();
      UserStore[updateUser.id - 1] = updateUser;
      return updateUser;
    }
    // else return null
    return { err: new Error('User does not exist') };
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

// add default admin user
Users.add({
  email: 'stephen.aribaba@gmail.com',
  username: 'Stephen',
  password: 'stephen',
  accountType: 'admin',
});

export default Users;
