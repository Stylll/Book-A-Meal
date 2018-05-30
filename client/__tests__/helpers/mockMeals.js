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

export {
  emptyMeal,
  invalidMeal,
  longMealName,
  validMeal,
  saveMealResponse,
  saveMealFailedResponse,
  saveMealFailedResponseB,
};
