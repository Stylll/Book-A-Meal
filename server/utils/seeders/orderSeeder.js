
/**
 * This script contains template order data to use for test.
 */
const validOrder1 = {
  mealId: 1,
  price: 1500,
  quantity: 3,
  userId: 1,
};

const validOrder2 = {
  mealId: 2,
  price: 1000,
  quantity: 4,
  userId: 1,
};

const completeOrder = {
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

const insertSeedOrder = (order) => {
  orders.add(order);
};

const clearOrders = () => {
  orders.trucate();
};

export {
  validOrder1,
  validOrder2,
  invalidOrder,
  existingOrder,
  completeOrder,
  canceledOrder,
  insertSeedOrder,
  clearOrders,
};
