import orders from '../../db/orders';
/**
 * This script contains template order data to use for test.
 */
const orderWith1500 = {
  mealId: 1,
  price: 1500,
  quantity: 3,
  userId: 1,
};

const orderWith1000 = {
  mealId: 1,
  price: 1000,
  quantity: 4,
  userId: 1,
};

const completedOrder = {
  mealId: 1,
  price: 1000,
  quantity: 2,
  status: 'complete',
  userId: 1,
};

const canceledOrder = {
  mealId: 1,
  price: 1000,
  quantity: 5,
  status: 'canceled',
  userId: 1,
};

const invalidOrder = {
  mealId: 0,
  price: 0,
  quantity: 0,
  status: 'pending',
  userId: 1,
};

const existingOrder = {
  mealId: 1,
  price: 1500,
  quantity: 3,
  status: 'pending',
  userId: 1,
};

/**
 * Inserts order into orders table
 * @param {object} order
 */
const insertSeedOrder = async (order) => {
  await orders.add(order);
};

/**
 * truncate table orders
 */
const clearOrders = async () => {
  await orders.truncate();
};

export {
  orderWith1500,
  orderWith1000,
  invalidOrder,
  existingOrder,
  completedOrder,
  canceledOrder,
  insertSeedOrder,
  clearOrders,
};
