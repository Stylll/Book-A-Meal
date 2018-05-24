let localStorage = {};

/**
 * Local storage mock object
 */
export default {
  setItem: (key, value) => Object.assign(localStorage, { [key]: value }),
  getItem: key => localStorage[key],
  removeItem: key => delete localStorage[key],
  clear: () => {
    localStorage = {};
  },
};