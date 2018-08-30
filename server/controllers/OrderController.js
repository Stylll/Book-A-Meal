/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import moment from 'moment';
import { isEmpty } from 'lodash';
import orders from '../db/orders';
import meals from '../db/meals';
import Models from '../models';
import OrderUtils from '../utils/orders/orderUtils';
import paginator from '../utils/paginator';

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
      return response.status(201)
        .json({ order: newOrder, message: 'Created successfully' });
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
      // update order, save order and return new order
      order.mealId = (request.body.mealId)
        ? parseInt(request.body.mealId, 10) : order.mealId;
      order.quantity = (request.body.quantity)
        ? parseInt(request.body.quantity, 10) : order.quantity;
      const meal = await meals.get(order.mealId);
      order.price = (request.body.mealId)
        ? meal.price : order.price;
      order.status = request.body.status || order.status;
      order.cost = parseInt(order.quantity, 10) * parseFloat(order.price, 10);

      const rawOrder = await orders.update(order);
      const newOrder = await OrderUtils.buildOrder(rawOrder);

      return response.status(200)
        .json({ order: newOrder, message: 'Updated successfully' });
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
    const limit = request.query.limit || 10;
    const offset = request.query.offset || 0;
    const status = request.query.status || null;
    if (request.decoded.user.accountType === 'admin') {
      /**
       * get all orders from the db
       * pass it through the builder to attach meal and user objects
       * return the order array
       */
      const rawOrders = await orders.getAll(limit, offset, status);
      const orderArray = await OrderUtils.buildOrders(rawOrders.orders);
      return response.status(200)
        .json({ orders: orderArray, pagination: rawOrders.pagination });
    }
    if (request.decoded.user.accountType === 'caterer') {
      /**
       * get all orders from the db where meal was created by the caterer
       * pass it through the builder to attach meal and user objects
       * return the order array
       */
      const rawOrders = await orders.getByCatererId(
        request.decoded.user.id, limit,
        offset, status,
      );
      const orderArray = await OrderUtils.buildOrders(rawOrders.orders);
      return response.status(200)
        .json({ orders: orderArray, pagination: rawOrders.pagination });
    }
    if (request.decoded.user.accountType === 'customer') {
      /**
       * get orders by user id from the db
       * pass it through the builder to attach meal and user objects
       * return the order array
       */
      const rawOrders = await orders.getByUserId(
        request.decoded.user.id, limit,
        offset, status,
      );
      const orderArray = await OrderUtils.buildOrders(rawOrders.orders);
      return response.status(200)
        .json({ orders: orderArray, pagination: rawOrders.pagination });
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
    const limit = request.query.limit || 10;
    const offset = request.query.offset || 0;
    if (request.decoded.user.accountType === 'admin') {
      /**
       * get order summary for all completed orders
       */
      const orderSummary = await Models.Orders.findAndCountAll({
        group: [
          [Models.sequelize.fn(
            'to_char',
            Models.sequelize.col('createdAt'), 'YYYY-MM-DD',
          )],
        ],
        order: [
          [Models.sequelize.fn(
            'to_char',
            Models.sequelize.col('createdAt'), 'YYYY-MM-DD',
          ), 'DESC'],
        ],
        attributes: [
          [Models.sequelize.fn('COUNT', Models.sequelize.col('id')), 'totalOrder'],
          [Models.sequelize.fn(
            'sum',
            Models.sequelize.col('quantity'),
          ), 'totalQuantity'],
          [Models.sequelize.fn('sum', Models.sequelize.col('cost')), 'totalSale'],
          [Models.sequelize.fn(
            'count',
            Models.sequelize.fn('distinct', Models.sequelize.col('userId')),
          ), 'totalCustomer'],
          [Models.sequelize.fn(
            'to_char',
            Models.sequelize.col('createdAt'), 'YYYY-MM-DD',
          ), 'orderDate'],
        ],
        where: {
          status: 'complete',
        },
        limit,
        offset,
      });
      if (isEmpty(orderSummary.rows)) {
        return response.status(200).json({
          orders: [],
          pagination: paginator(limit, offset, 0),
        });
      }
      return response.status(200)
        .json({
          orders: orderSummary.rows,
          pagination: paginator(limit, offset, orderSummary.count.length),
        });
    }

    /**
     * for normal caterers,
     * get caterers meals,
     * use meals to get order summary
     */
    let catererMeals = await Models.Meals.findAll({
      where: {
        userId: request.decoded.user.id,
      },
      raw: true,
      paranoid: false,
      attributes: ['id'],
    });

    catererMeals = catererMeals.map(meal => meal.id);

    const orderSummary = await Models.Orders.findAndCountAll({
      group: [
        [Models.sequelize.fn(
          'to_char',
          Models.sequelize.col('createdAt'), 'YYYY-MM-DD',
        )],
      ],
      order: [
        [Models.sequelize.fn(
          'to_char',
          Models.sequelize.col('createdAt'), 'YYYY-MM-DD',
        ), 'DESC'],
      ],
      attributes: [
        [Models.sequelize.fn('COUNT', Models.sequelize.col('id')), 'totalOrder'],
        [Models.sequelize.fn('sum', Models.sequelize.col('quantity')), 'totalQuantity'],
        [Models.sequelize.fn('sum', Models.sequelize.col('cost')), 'totalSale'],
        [Models.sequelize.fn(
          'count',
          Models.sequelize.fn('distinct', Models.sequelize.col('userId')),
        ), 'totalCustomer'],
        [Models.sequelize.fn(
          'to_char',
          Models.sequelize.col('createdAt'), 'YYYY-MM-DD',
        ), 'orderDate'],
      ],
      where: {
        status: 'complete',
        mealId: {
          [Models.sequelize.Op.in]: catererMeals,
        },
      },
      limit,
      offset,
    });
    if (isEmpty(orderSummary.rows)) {
      return response.status(200).json({
        orders: [],
        pagination: paginator(limit, offset, 0),
      });
    }
    return response.status(200)
      .json({
        orders: orderSummary.rows,
        pagination: paginator(limit, offset, orderSummary.count.length),
      });
  }
}

export default OrderController;
