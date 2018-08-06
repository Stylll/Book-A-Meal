export default {
  auth: {
    isAuthenticated: false,
    isCaterer: false,
    user: {},
    errors: {},
  },
  meals: {
    meals: [],
    errors: {},
    pagination: {},
  },
  menus: {
    menus: [],
    menu: {},
    currentMenu: {},
    errors: {},
    pagination: {},
  },
  orders: {
    isCustomer: false,
    isCaterer: false,
    customerOrders: {
      orders: [],
      errors: {},
      pagination: {},
    },
    catererOrders: {
      orders: [],
      errors: {},
      summary: [],
      pagination: {},
    },
  },
};
