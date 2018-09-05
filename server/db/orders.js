import { isEmpty } from 'lodash';
import { Op } from 'sequelize';
import meals from './meals';
import { Orders as OrderModel } from '../models';
import paginator from '../utils/paginator';

/**
 * Order model class
 * Performs CRUD operations on an order
 */
class Orders {
  /**
   * Static method to add an order to the db
   * @param {object} order
   * @returns {object} {order} | {err}
   */
  static async add(order) {
    // check if meal id is provided
    if (!order.mealId) return { err: new Error('Meal id is required') };

    // check if meal id is valid
    if (!Number.isInteger(order.mealId)) {
      return { err: new Error('Meal id is invalid') };
    }

    // check if meal id exists
    const curryRice = await meals.get(order.mealId);
    if (!curryRice) return { err: new Error('Meal does not exist') };

    // check if price is provided
    if (!order.price) return { err: new Error('Price is required') };

    // check if price is a number
    if (/[^0-9.]/gi.test(order.price) === true) {
      return { err: new Error('Price is invalid') };
    }

    // check if price is less than or equal to 1
    if (order.price <= 1) {
      return { err: new Error('Price must be greater than one') };
    }

    // check if quantity is provided
    if (!order.quantity) return { err: new Error('Quantity is required') };

    // check if quantity is valid
    if (!Number.isInteger(order.quantity)) {
      return { err: new Error('Quantity is invalid') };
    }

    // check if user id is provided
    if (!order.userId) return { err: new Error('User id is required') };

    // check if user id is valid
    if (!Number.isInteger(order.userId)) {
      return { err: new Error('User id is invalid') };
    }

    // create and populate new order object
    const newOrder = {
      mealId: parseInt(order.mealId, 10),
      price: parseFloat(order.price, 10),
      quantity: parseInt(order.quantity, 10),
      status: 'pending',
      userId: parseInt(order.userId, 10),
      cost: parseFloat(order.price, 10) * parseInt(order.quantity, 10),
    };

    // add new order to the db
    return OrderModel.create(newOrder)
      .then((savedOrder) => {
        if (savedOrder) {
          return savedOrder.dataValues;
        }
        return null;
      });
  }

  /**
   * Static method to update an order
   * @param {object} order
   * @returns {object|null} updatedOrder | {err}
   */
  static async update(order) {
    // check if order id is provided
    if (!order.id) return { err: new Error('Order id is required') };

    // check if order id is valid
    if (!Number.isInteger(order.id)) {
      return { err: new Error('Order id is invalid') };
    }

    // check if meal id is valid if provided
    if (order.mealId && !Number.isInteger(order.mealId)) {
      return { err: new Error('Meal id is invalid') };
    }

    // check if meal id exists if provided
    const curryRice = await meals.get(order.mealId);
    if (order.mealId && !curryRice) {
      return { err: new Error('Meal does not exist') };
    }

    // check if price is a number if provided
    if (order.price && /[^0-9.]/gi.test(order.price) === true) {
      return { err: new Error('Price is invalid') };
    }

    // check if price is less than or equal to 1 if provided
    if (order.price && order.price <= 1) {
      return { err: new Error('Price must be greater than one') };
    }

    // check if quantity is valid if provided
    if (order.quantity && !Number.isInteger(order.quantity)) {
      return { err: new Error('Quantity is invalid') };
    }

    // check if status is valid if provided
    if (order.status) {
      if (!(order.status === 'pending') && !(order.status === 'complete')
        && !(order.status === 'canceled')) {
        return { err: new Error('Status is invalid') };
      }
    }
    // save updated order
    return OrderModel.findById(order.id)
      .then((returnedOrder) => {
        if (isEmpty(returnedOrder)) {
          return { err: new Error('Order does not exist') };
        }
        return returnedOrder.update(order)
          .then((updateOrder) => {
            if (updateOrder) {
              return updateOrder.dataValues;
            }
            return null;
          });
      });
  }

  /**
   * Static method to get order by order id
   * @param {integer} id
   * @returns {object|null|undefined} order | null | undefined
   */
  static get(orderId) {
    const id = parseInt(orderId, 10);
    if (!Number.isInteger(id)) return null;
    return OrderModel.findById(id, {
      raw: true,
    })
      .then((returnedOrder) => {
        if (isEmpty(returnedOrder)) {
          return undefined;
        }
        return returnedOrder;
      });
  }

  /**
   * Static method to return all orders in the db
   * @returns {array} Orders
   */
  static getAll(limit = 10, offset = 0, status = null) {
    const where = {};
    if (status) where.status = status;
    return OrderModel.findAndCountAll({
      where,
      raw: true,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    })
      .then((returnedOrder) => {
        if (isEmpty(returnedOrder.rows)) {
          return {
            orders: [],
            pagination: paginator(limit, offset, 0),
          };
        }
        return {
          orders: returnedOrder.rows,
          pagination: paginator(limit, offset, returnedOrder.count),
        };
      });
  }

  /**
   * Static method to return orders using meal id
   * @param {integer} id
   * @returns {array|null} orders
   */
  static getByMealId(mealId, limit = 10, offset = 0, status = false) {
    const id = parseInt(mealId, 10);
    const where = {
      mealId,
    };
    if (status) where.status = status;
    if (Number.isInteger(id)) {
      return OrderModel.findAndCountAll({
        where,
        raw: true,
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      })
        .then((returnedOrder) => {
          if (isEmpty(returnedOrder.rows)) {
            return {
              orders: [],
              pagination: paginator(limit, offset, 0),
            };
          }
          return {
            orders: returnedOrder.rows,
            pagination: paginator(limit, offset, returnedOrder.count),
          };
        });
    }
    return null;
  }

  /**
   * Static method to get orders using status
   * @param {string} status
   * @returns {array|null} orders
   */
  static getByStatus(status, limit = 10, offset = 0) {
    if (!status) return null;
    return OrderModel.findAndCountAll({
      where: {
        status,
      },
      raw: true,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    })
      .then((returnedOrder) => {
        if (isEmpty(returnedOrder.rows)) {
          return {
            orders: [],
            pagination: paginator(limit, offset, 0),
          };
        }
        return {
          orders: returnedOrder.rows,
          pagination: paginator(limit, offset, returnedOrder.count),
        };
      });
  }

  /**
   * Static method to get orders using user id
   * @param {integer} userId
   * @returns {array|null} orders | null
   */
  static getByUserId(userId, limit = 10, offset = 0, status = null) {
    const id = parseInt(userId, 10);
    const where = {
      userId,
    };
    if (status) where.status = status;
    if (!Number.isInteger(id)) return null;
    return OrderModel.findAndCountAll({
      where,
      raw: true,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    })
      .then((returnedOrder) => {
        if (isEmpty(returnedOrder.rows)) {
          return {
            orders: [],
            pagination: paginator(limit, offset, 0),
          };
        }
        return {
          orders: returnedOrder.rows,
          pagination: paginator(limit, offset, returnedOrder.count),
        };
      });
  }

  /**
   * static method to get orders using caterer id
   * @param {integer} catererId
   * @param {integer} limit
   * @param {integer} offset
   * @return {array|null} orders
   */
  static async getByCatererId(
    catererId,
    limit = 10, offset = 0, status = null,
  ) {
    const id = parseInt(catererId, 10);
    if (!Number.isInteger(id)) {
      return {
        orders: [],
        pagination: paginator(limit, offset, 0),
      };
    }
    const catererMeals = await meals.getByUserId(id, false);
    const mealIds = [];
    if (isEmpty(catererMeals)) {
      return {
        orders: [],
        pagination: paginator(limit, offset, 0),
      };
    }
    catererMeals.meals.forEach(meal => mealIds.push(meal.id));

    const where = {
      mealId: {
        [Op.in]: mealIds,
      },
    };
    if (status) where.status = status;
    return OrderModel.findAndCountAll({
      where,
      raw: true,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    })
      .then((returnedOrder) => {
        if (isEmpty(returnedOrder.rows)) {
          return {
            orders: [],
            pagination: paginator(limit, offset, 0),
          };
        }
        return {
          orders: returnedOrder.rows,
          pagination: paginator(limit, offset, returnedOrder.count),
        };
      });
  }

  /**
   * Static method to delete order by order id
   * @param {integer} id
   */
  static delete(id) {
    return OrderModel.findById(id)
      .then((returnedOrder) => {
        if (isEmpty(returnedOrder)) {
          return { err: new Error('Order does not exist') };
        }
        return returnedOrder.destroy()
          .then(() => null);
      });
  }

  /**
   * static method to truncate records in the db
   */
  static truncate() {
    return OrderModel.sync({ force: true })
      .then(() => null);
  }
}

export default Orders;
