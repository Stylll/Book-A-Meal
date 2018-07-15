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

export {
  saveOrderResponse,
  saveOrderFailedResponse,
  saveOrderFailedResponseB,
};
