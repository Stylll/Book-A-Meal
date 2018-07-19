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
    get: '/api/v1/meals',
    delete: id => (`/api/v1/meals/${id}`),
  },
  menu: {
    post: '/api/v1/menu',
    put: id => (`/api/v1/menu/${id}`),
    get: '/api/v1/menu',
  },
  orders: {
    post: '/api/v1/orders',
    put: id => (`/api/v1/orders/${id}`),
    get: '/api/v1/orders',
    delete: id => (`/api/v1/orders/${id}`),
  },
};

export default api;
