const saveOrderResponse = {
  order: {
    id: 1,
    mealId: 4,
    price: 6000,
    quantity: 3,
    status: 'pending',
    userId: 4,
    cost: 18000,
    updatedAt: '2018-05-16T15:02:02.585Z',
    createdAt: '2018-05-16T15:02:02.585Z',
  },
  message: 'Created successfully',
};

const saveOrderFailedResponse = {
  errors: {
    meal: {
      message: 'Meal does not exist',
      statusCode: 400,
    },
    menu: {
      message: 'No menu is set',
      statusCode: 400,
    },
  },
};

const saveOrderFailedResponseB = {
  message: 'An unexpected error occurred',
};

const getOrdersResponse = {
  orders: [
    {
      id: 1,
      mealId: 2,
      price: 200,
      quantity: 4,
      cost: 800,
      userId: 4,
      status: 'pending',
      createdAt: '2018-07-15T08:37:36.149Z',
      updatedAt: '2018-07-15T08:37:36.149Z',
      meal: {
        id: 2,
        name: 'Bread',
        image: 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg',
        price: 200,
        userId: 1,
      },
      user: {
        id: 4,
        email: 'victor@kenny.com',
        username: 'victor',
        accountType: 'customer',
      },
    },
    {
      id: 2,
      mealId: 2,
      price: 200,
      quantity: 5,
      cost: 1000,
      userId: 4,
      status: 'pending',
      createdAt: '2018-07-15T08:37:36.149Z',
      updatedAt: '2018-07-15T08:37:36.149Z',
      meal: {
        id: 2,
        name: 'Bread',
        image: 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg',
        price: 200,
        userId: 1,
      },
      user: {
        id: 4,
        email: 'victor@kenny.com',
        username: 'victor',
        accountType: 'customer',
      },
    },
    {
      id: 3,
      mealId: 2,
      price: 200,
      quantity: 5,
      cost: 1000,
      userId: 4,
      status: 'pending',
      createdAt: '2018-07-15T08:37:36.149Z',
      updatedAt: '2018-07-15T08:37:36.149Z',
      meal: {
        id: 2,
        name: 'Bread',
        image: 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg',
        price: 200,
        userId: 1,
      },
      user: {
        id: 4,
        email: 'victor@kenny.com',
        username: 'victor',
        accountType: 'customer',
      },
    },
    {
      id: 4,
      mealId: 2,
      price: 200,
      quantity: 3,
      cost: 600,
      userId: 4,
      status: 'pending',
      createdAt: '2018-07-15T08:37:36.149Z',
      updatedAt: '2018-07-15T08:37:36.149Z',
      meal: {
        id: 2,
        name: 'Bread',
        image: 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg',
        price: 200,
        userId: 1,
      },
      user: {
        id: 4,
        email: 'victor@kenny.com',
        username: 'victor',
        accountType: 'customer',
      },
    },
  ],
};

const getOrdersFailedResponse = {
  message: 'An error occurred',
  status: 500,
};

const deleteOrderResponse = {
  status: 200,
  message: 'Order deleted successfully',
};

const deleteOrderFailedResponse = {
  status: 401,
  message: 'Unauthorized Access',
};

const deleteOrderFailedResponseB = {
  errors: {
    id: {
      message: 'Order does not exist',
      status: 404,
    },
  },
};

export {
  saveOrderResponse,
  saveOrderFailedResponse,
  saveOrderFailedResponseB,
  getOrdersResponse,
  getOrdersFailedResponse,
  deleteOrderResponse,
  deleteOrderFailedResponse,
  deleteOrderFailedResponseB,
};
