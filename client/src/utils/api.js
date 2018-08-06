/**
 * Object that stores api endpoints
 */
const api = {
  user: {
    signUp: '/api/v1/users/signup',
    signin: '/api/v1/users/signin',
  },
  meals: {
    post: '/api/v1/meals',
    put: id => (`/api/v1/meals/${id}`),
    get: (limit = 10, offset = 0) =>
      (`/api/v1/meals?limit=${limit}&offset=${offset}`),
    delete: id => (`/api/v1/meals/${id}`),
  },
  menu: {
    post: '/api/v1/menu',
    put: id => (`/api/v1/menu/${id}`),
    get: (limit = 10, offset = 0) =>
      (`/api/v1/menu?limit=${limit}&offset=${offset}`),
    getById: (id, limit = 10, offset = 0) =>
      (`/api/v1/menu/${id}?limit=${limit}&offset=${offset}`),
  },
  orders: {
    post: '/api/v1/orders',
    put: id => (`/api/v1/orders/${id}`),
    get: (limit = 10, offset = 0, status = '') =>
      (`/api/v1/orders?limit=${limit}&offset=${offset}&status=${status}`),
    delete: id => (`/api/v1/orders/${id}`),
    summary: (limit = 10, offset = 0) =>
      (`/api/v1/orders/summary?limit=${limit}&offset=${offset}`),
  },
};

export default api;
