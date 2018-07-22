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
  },
  menus: {
    menus: [],
    currentMenu: {},
    errors: {},
  },
  orders: {
    isCustomer: false,
    isCaterer: false,
    customerOrders: {
      orders: [],
      errors: {},
    },
    catererOrders: {
      orders: [],
      errors: {},
      summary: [],
    },
  },
};
