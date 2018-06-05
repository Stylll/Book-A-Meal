const emptyMeal = {
  name: '',
  price: '',
};

const invalidMeal = {
  name: '@#Egusi',
  price: 'abc123abc',
};

const longMealName = {
  name: 'lorem ipsum lorem ipsum vidic exerpt ipsum lorem exerpt ipsum lorem ipsum',
  price: '599.99',
};

const validMeal = {
  name: 'Jollof Rice',
  price: '2500',
};

const saveMealResponse = {
  meal: {
    id: 5,
    name: 'Beans',
    price: 200.45,
    image: 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg',
    userId: 1,
    updatedAt: '2018-05-29T23:36:40.047Z',
    createdAt: '2018-05-29T23:36:40.047Z',
  },
  message: 'Created successfully',
};

const saveMealFailedResponse = {
  message: 'An error occurred',
  status: 401,
};

const saveMealFailedResponseB = {
  errors: {
    name: {
      message: 'Meal name already exists',
      statusCode: 400,
    },
  },
};

const getMealsResponse = {
  meals: [
    {
      id: 1,
      name: 'Bread',
      image: 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg',
      price: 200,
      userId: 1,
    },
    {
      id: 2,
      name: 'Fried Rice',
      image: 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg',
      price: 2500.23,
      userId: 1,
    },
  ],
};

const getMealsFailedResponse = {
  message: 'An error occurred',
  status: 500,
};

const deleteMealResponse = {
  status: 200,
  message: 'Meal deleted successfully',
};

const deleteMealFailedResponse = {
  status: 401,
  message: 'Unauthorized Access',
};

const deleteMealFailedResponseB = {
  errors: {
    id: {
      message: 'Meal does not existss',
      status: 401,
    }
  }
}

export {
  emptyMeal,
  invalidMeal,
  longMealName,
  validMeal,
  saveMealResponse,
  saveMealFailedResponse,
  saveMealFailedResponseB,
  getMealsResponse,
  getMealsFailedResponse,
  deleteMealResponse,
  deleteMealFailedResponse,
  deleteMealFailedResponseB,
};
