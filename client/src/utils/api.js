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
    put: id => (`/api/v1/meals${id}`),
  },
};

export default api;