import generateId from '../utils/generateId';
import meals from './meals';

// variable to store the menu records.
const OrderStore = [];

/**
 * Menu model class
 * Performs CRUD operations on a menu
 */
class Orders {
  /**
   * Static method to add an order to the db
   * @param {object} order
   * @returns {object} createdOrder
   */
  static add(order) {
    // check if meal id is provided
    if (!order.mealId) return { err: new Error('Meal id is required') };

    // check if meal id is valid
    if (!Number.isInteger(order.mealId)) return { err: new Error('Meal id is invalid') };

    // check if meal id exists
    if (!meals.get(order.mealId)) return { err: new Error('Meal does not exist') };

    // check if price is provided
    if (!order.price) return { err: new Error('Price is required') };

    // check if price is a number
    if (/[^0-9.]/gi.test(order.price) === true) {
      return { err: new Error('Price is invalid') };
    }

    // check if price is less than or equal to 1
    if (order.price <= 1) return { err: new Error('Price must be greater than one') };

    // check if quantity is provided
    if (!order.quantity) return { err: new Error('Quantity is required') };

    // check if quantity is valid
    if (!Number.isInteger(order.quantity)) return { err: new Error('Quantity is invalid') };

    // check if user id is provided
    if (!order.userId) return { err: new Error('User id is required') };

    // check if user id is valid
    if (!Number.isInteger(order.userId)) return { err: new Error('User id is invalid') };

    // create and populate new order object
    const newOrder = {
      id: generateId(OrderStore),
      mealId: parseInt(order.mealId, 10),
      price: order.price,
      quantity: parseInt(order.quantity, 10),
      status: 'pending',
      userId: parseInt(order.userId, 10),
      cost: order.price * parseInt(order.quantity, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // add new order to the db
    OrderStore.push(newOrder);

    return newOrder;
  }

  /**
   * Static method to add bulk orders
   * @param {array} orderArray
   */
  static addBulk(orderArray) {
    orderArray.forEach((order) => {
      this.add(order);
    });
  }

  /**
   * Static method to update an order
   * @param {object} order
   * @returns {object} updatedOrder
   */
  static update(order) {
    // check if order id is provided
    if (!order.id) return { err: new Error('Order id is required') };

    // check if order id is valid
    if (!Number.isInteger(order.id)) return { err: new Error('Order id is invalid') };

    // check if order id exists
    if (!OrderStore[parseInt(order.id, 10) - 1]) {
      return { err: new Error('Order does not exist') };
    }

    // check if meal id is valid if provided
    if (order.mealId && !Number.isInteger(order.mealId)) return { err: new Error('Meal id is invalid') };

    // check if meal id exists if provided
    if (order.mealId && !meals.get(order.mealId)) return { err: new Error('Meal does not exist') };

    // check if price is a number if provided
    if (order.price && /[^0-9.]/gi.test(order.price) === true) {
      return { err: new Error('Price is invalid') };
    }

    // check if price is less than or equal to 1 if provided
    if (order.price && order.price <= 1) return { err: new Error('Price must be greater than one') };

    // check if quantity is valid if provided
    if (order.quantity && !Number.isInteger(order.quantity)) return { err: new Error('Quantity is invalid') };

    // check if status is valid if provided
    if (order.status) {
      if (!(order.status === 'pending') && !(order.status === 'complete') && !(order.status === 'canceled')) {
        return { err: new Error('Status is invalid') };
      }
    }

    // create update object
    const oldOrder = OrderStore[order.id - 1];
    if (oldOrder) {
      // populate oldOrder with new details if it exists
      oldOrder.mealId = order.mealId || oldOrder.mealId;
      oldOrder.price = order.price || oldOrder.price;
      oldOrder.quantity = order.quantity || oldOrder.quantity;
      oldOrder.cost = oldOrder.price * oldOrder.quantity;
      oldOrder.status = order.status || oldOrder.status;
      oldOrder.updatedAt = new Date();

      // save updated order
      OrderStore[order.id - 1] = oldOrder;

      return oldOrder;
    }
    return null;
  }

  /**
   * Static method to get order by order id
   * @param {integer} id
   * @returns {object|null|undefined} order | null | undefined
   */
  static get(orderId) {
    const id = parseInt(orderId, 10);
    if (Number.isInteger(id)) {
      return OrderStore[id - 1];
    }
    return null;
  }

  /**
   * Static method to return all orders in the db
   * @returns {array} Orders
   */
  static getAll() {
    return OrderStore;
  }

  /**
   * Static method to return orders using meal id
   * @param {integer} id
   * @returns {array|null} orders | null
   */
  static getByMealId(mealId) {
    const id = parseInt(mealId, 10);
    if (Number.isInteger(id)) {
      return OrderStore.filter(order => order.mealId === id);
    }
    return null;
  }

  /**
   * Static method to get orders using status
   * @param {string} status
   * @returns {array|null} orders
   */
  static getByStatus(status) {
    if (status) {
      return OrderStore.filter(order => order.status === status);
    }
    return null;
  }

  /**
   * Static method to get orders using user id
   * @param {integer} userId
   * @returns {array|null} orders | null
   */
  static getByUserId(userId) {
    const id = parseInt(userId, 10);
    if (Number.isInteger(id)) {
      return OrderStore.filter(order => order.userId === id);
    }
    return null;
  }

  /**
   * Static method to delete order by order id
   * @param {integer} id
   */
  static delete(id) {
    delete OrderStore[id - 1];
  }

  /**
   * static method to truncate records in the db
   */
  static truncate() {
    OrderStore.length = 0;
  }
}

export default Orders;
