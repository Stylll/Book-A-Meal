import { isEmpty } from 'lodash';
import Moment from 'moment';
import meals from '../../db/meals';
import users from '../../db/users';


/**
 * Helper class to implement functions related
 * to menu objects and requests
 */

class OrderUtils {
  /**
   * Static method to build a complete order
   * adds meal object to the order
   * adds user object to the order
   * @param {object} orderObject
   * @returns {object} completeOrder
   */
  static async buildOrder(orderObject) {
    if (isEmpty(orderObject)) return orderObject;

    // populate the initial order object
    const order = {
      id: orderObject.id,
      mealId: orderObject.mealId,
      price: orderObject.price,
      quantity: orderObject.quantity,
      cost: orderObject.cost,
      userId: orderObject.userId,
      status: orderObject.status,
      createdAt: orderObject.createdAt,
      updatedAt: orderObject.updatedAt,
      meal: {},
      user: {},
    };

    // get meal using meal id and add it to the order object
    const meal = await meals.get(orderObject.mealId);
    if (meal) order.meal = meal;

    // get user using user id and add to the order object
    const user = await users.get(orderObject.userId);
    if (user) {
      order.user = {
        id: user.id,
        email: user.email,
        username: user.username,
        accountType: user.accountType,
      };
    }

    return order;
  }

  /**
   * Static method to build complete order in an array
   * calls buildOrder with each order in the array
   * @param {array} orderArray
   * @returns {array} completeOrderArray
   */
  static async buildOrders(orderArray) {
    let orderList = [...orderArray];
    orderList = await Promise.all(orderList.map(order => this.buildOrder(order)));
    return orderList;
  }

  /**
   * Static method to get the difference in hour between order date and current date
   * @param {object} order
   * @returns {integer} difference
   */
  static getHourDiff(order) {
    const orderDate = new Moment(order.createdAt);
    const currentDate = new Moment(new Date());
    const diff = Moment.duration(currentDate.diff(orderDate)).asHours();
    return diff;
  }
}

export default OrderUtils;
