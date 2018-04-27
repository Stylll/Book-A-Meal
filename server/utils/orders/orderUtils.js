import { isEmpty } from 'lodash';
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
  static buildOrder(orderObject) {
    if (isEmpty(orderObject)) return orderObject;

    // populate the initial order object
    const order = {
      id: orderObject.id,
      mealId: orderObject.mealId,
      price: orderObject.price,
      quantity: orderObject.quantity,
      cost: orderObject.cost,
      userId: orderObject.userId,
      meal: {},
      user: {},
    };

    // get meal using meal id and add it to the order object
    const meal = { ...meals.get(orderObject.id) };
    if (meal) order.meal = meal;

    // get user using user id and add to the order object
    const user = { ...users.get(orderObject.userId) };
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
  static buildOrders(orderArray) {
    let orderList = [...orderArray];
    orderList = orderList.map(order => this.buildOrder(order));
    return orderList;
  }
}

export default OrderUtils;
