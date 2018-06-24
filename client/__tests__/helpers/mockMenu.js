const saveMenuResponse = {
  menu: {
    id: 1,
    name: 'Menu For Saturday, 9 June 2018',
    date: '2018-06-9',
    mealIds: [
      1,
    ],
    userId: 1,
    meals: [
      {
        id: 1,
        name: 'Yam and eggs',
        image: 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg',
        price: 1500,
        userId: 1,
        MenuMeals: {
          menuId: 1,
          mealId: 1,
          createdAt: '2018-06-09T15:02:45.698Z',
          updatedAt: '2018-06-09T15:02:45.698Z',
        },
      },
    ],
  },
  message: 'Created successfully',
};

const updateMenuResponse = {
  menu: {
    id: 1,
    name: 'Menu For Saturday, 9 June 2018',
    date: '2018-06-9',
    mealIds: [
      1,
    ],
    userId: 1,
    meals: [
      {
        id: 1,
        name: 'Yam and eggs',
        image: 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg',
        price: 1500,
        userId: 1,
        MenuMeals: {
          menuId: 1,
          mealId: 1,
          createdAt: '2018-06-09T15:02:45.698Z',
          updatedAt: '2018-06-09T15:02:45.698Z',
        },
      },
    ],
  },
  message: 'Updated successfully',
};

const saveMenuFailedResponse = {
  errors: {
    menu: {
      message: 'Menu for the day already exists',
      statusCode: 409,
    },
  },
};

const saveMenuFailedResponseB = {
  message: 'An error occurred',
  status: 400,
};

const validMenu = {
  mealIds: [1, 2, 3, 4],
};

const invalidMenu = {
  mealIds: [1, 'ab', 'ds'],
};

const emptyMenu = {
  mealIds: [],
};

const getMenuResponse = {
  menus: [
    {
      id: 2,
      name: 'Menu For Friday, 15 June 2018',
      date: '2018-06-15',
      mealIds: [
        1,
        3,
        5,
      ],
      userId: 1,
      meals: [
        {
          id: 1,
          name: 'Yam and eggs',
          image: 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg',
          price: 1500,
          userId: 1,
          MenuMeals: {
            menuId: 2,
            mealId: 1,
            createdAt: '2018-06-15T16:30:01.188Z',
            updatedAt: '2018-06-15T16:30:01.188Z',
          },
        },
        {
          id: 3,
          name: 'Fried Rice with chicken',
          image: 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg',
          price: 2000,
          userId: 1,
          MenuMeals: {
            menuId: 2,
            mealId: 3,
            createdAt: '2018-06-15T16:30:01.188Z',
            updatedAt: '2018-06-15T16:30:01.188Z',
          },
        },
        {
          id: 5,
          name: 'Beans and Bread',
          image: 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg',
          price: 1200,
          userId: 1,
          MenuMeals: {
            menuId: 2,
            mealId: 5,
            createdAt: '2018-06-15T16:30:01.188Z',
            updatedAt: '2018-06-15T16:30:01.188Z',
          },
        },
      ],
    },
    {
      id: 1,
      name: 'Menu For Saturday, 9 June 2018',
      date: '2018-06-9',
      mealIds: [
        1,
      ],
      userId: 1,
      meals: [
        {
          id: 1,
          name: 'Yam and eggs',
          image: 'https://res.cloudinary.com/styll/image/upload/v1524560568/foods.jpg',
          price: 1500,
          userId: 1,
          MenuMeals: {
            menuId: 1,
            mealId: 1,
            createdAt: '2018-06-09T15:02:45.698Z',
            updatedAt: '2018-06-09T15:02:45.698Z',
          },
        },
      ],
    },
  ],
};

const getMenuFailedResponse = {
  message: 'Menu for the day not set',
};

export {
  saveMenuResponse,
  updateMenuResponse,
  saveMenuFailedResponse,
  saveMenuFailedResponseB,
  validMenu,
  invalidMenu,
  emptyMenu,
  getMenuResponse,
  getMenuFailedResponse,
};
