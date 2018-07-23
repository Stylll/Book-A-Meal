/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import moment from 'moment';
import { isEmpty } from 'lodash';
import orders from '../db/orders';
import meals from '../db/meals';
import db from '../models';
import OrderUtils from '../utils/orders/orderUtils';

dotenv.config();

class OrderController {
  /**
   * Static method to handle order post request
   * @param {object} request
   * @param {object} response
   * @returns {object} {order, message} | {message}
   */
  static async post(request, response) {
    // get price from meal object
    const meal = await meals.get(parseInt(request.body.mealId, 10));

    // create order object
    const order = {
      mealId: parseInt(request.body.mealId, 10),
      price: meal.price,
      quantity: parseInt(request.body.quantity, 10),
      userId: request.decoded.user.id,
    };

    // save the order object
    const rawOrder = await orders.add(order);
    const newOrder = await OrderUtils.buildOrder(rawOrder);

    if (newOrder && !newOrder.err) {
      return response.status(201).json({ order: newOrder, message: 'Created successfully' });
    }
    return response.status(500).json({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle order put requests
   * @param {object} request
   * @param {object} response
   * @returns {object} {order, message} | {message}
   */
  static async put(request, response) {
    // get order object
    const order = await orders.get(parseInt(request.params.id, 10));

    // if order exists
    if (order && !order.err) {
      // check if user is a customer and the create time has passed 2 hours
      if (request.decoded.user.accountType === 'customer') {
        if (OrderUtils.getHourDiff(order) >= process.env.ORDERTIMEOUT) {
          return response.status(403).json({
            message: 'Sorry. You no longer have the permission to make changes to this order.',
          });
        }
      }


      // update order, save order and return new order
      order.mealId = (request.body.mealId) ? parseInt(request.body.mealId, 10) : order.mealId;
      order.quantity = (request.body.quantity)
        ? parseInt(request.body.quantity, 10) : order.quantity;
      const meal = await meals.get(order.mealId);
      order.price = (request.body.mealId) ? meal.price
        : order.price;
      order.status = request.body.status || order.status;
      order.cost = parseInt(order.quantity, 10) * parseFloat(order.price, 10);

      const rawOrder = await orders.update(order);
      const newOrder = await OrderUtils.buildOrder(rawOrder);

      return response.status(200).json({ order: newOrder, message: 'Updated successfully' });
    }
    return response.status(500).json({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle order get requests
   * @param {object} request
   * @param {object} response
   * @returns {object} {orders} | {message}
   */
  static async get(request, response) {
    if (request.decoded.user.accountType === 'admin') {
      /**
       * get all orders from the db
       * pass it through the builder to attach meal and user objects
       * return the order array
       */
      const rawOrders = await orders.getAll();
      const orderArray = await OrderUtils.buildOrders(rawOrders);
      return response.status(200).json({ orders: orderArray });
    }
    if (request.decoded.user.accountType === 'caterer') {
      /**
       * get all orders from the db where meal was created by the caterer
       * pass it through the builder to attach meal and user objects
       * return the order array
       */
      const rawOrders = await orders.getByCatererId(request.decoded.user.id);
      const orderArray = await OrderUtils.buildOrders(rawOrders);
      return response.status(200).json({ orders: orderArray });
    }
    if (request.decoded.user.accountType === 'customer') {
      /**
       * get orders by user id from the db
       * pass it through the builder to attach meal and user objects
       * return the order array
       */
      const rawOrders = await orders.getByUserId(request.decoded.user.id);
      const orderArray = await OrderUtils.buildOrders(rawOrders);
      return response.status(200).json({ orders: orderArray });
    }
    return response.status(500).json({ message: 'Internal Server Error' });
  }

  /**
   * Static method to handle order summary requests
   * @param {object} request
   * @param {object} response
   * @returns {object} {orders} | {message}
   */
  static async summary(request, response) {
    if (request.decoded.user.accountType === 'admin') {
      /**
       * get order summary for all completed orders
       */
      const orderSummary = await db.Orders.findAll({
        group: [
          [db.sequelize.fn('to_char', db.sequelize.col('createdAt'), 'YYYY-MM-DD')],
        ],
        order: [
          [db.sequelize.fn('to_char', db.sequelize.col('createdAt'), 'YYYY-MM-DD'), 'DESC'],
        ],
        attributes: [
          [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalOrder'],
          [db.sequelize.fn('sum', db.sequelize.col('quantity')), 'totalQuantity'],
          [db.sequelize.fn('sum', db.sequelize.col('cost')), 'totalSale'],
          [db.sequelize.fn('count', db.sequelize.fn('distinct', db.sequelize.col('userId'))), 'totalCustomer'],
          [db.sequelize.fn('to_char', db.sequelize.col('createdAt'), 'YYYY-MM-DD'), 'orderDate'],
        ],
        where: {
          status: 'complete',
        },
      });
      if (isEmpty(orderSummary)) {
        return response.status(200).json({ orders: [] });
      }
      return response.status(200).json({ orders: orderSummary });
    }

    /**
     * for normal caterers,
     * get caterers meals,
     * use meals to get order summary
     */
    let catererMeals = await db.Meals.findAll({
      where: {
        userId: request.decoded.user.id,
      },
      raw: true,
      attributes: ['id'],
    });

    catererMeals = catererMeals.map(meal => meal.id);

    const orderSummary = await db.Orders.findAll({
      group: [
        [db.sequelize.fn('to_char', db.sequelize.col('createdAt'), 'YYYY-MM-DD')],
      ],
      order: [
        [db.sequelize.fn('to_char', db.sequelize.col('createdAt'), 'YYYY-MM-DD'), 'DESC'],
      ],
      attributes: [
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalOrder'],
        [db.sequelize.fn('sum', db.sequelize.col('quantity')), 'totalQuantity'],
        [db.sequelize.fn('sum', db.sequelize.col('cost')), 'totalSale'],
        [db.sequelize.fn('count', db.sequelize.fn('distinct', db.sequelize.col('userId'))), 'totalCustomer'],
        [db.sequelize.fn('to_char', db.sequelize.col('createdAt'), 'YYYY-MM-DD'), 'orderDate'],
      ],
      where: {
        status: 'complete',
        mealId: {
          [db.sequelize.Op.in]: catererMeals,
        },
      },
    });
    if (isEmpty(orderSummary)) {
      return response.status(200).json({ orders: [] });
    }
    return response.status(200).json({ orders: orderSummary });
  }
}

export default OrderController;
