import axios from 'axios';
/**
 * Sets the authorization token to axios api header
 * Deletes the axios api authorization header if token is invalid
 * @param {string} token gotten from the api
 */

const setAuthorizationToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-access-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-access-token'];
  }
};

export default setAuthorizationToken;
