import { isPlainObject, isEmpty } from 'lodash';

// array containing names of months
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
  'November', 'December'];

// array containing names of days in a week
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


/**
 * method to retrieve message value from a 2 layer object.
 * It takes the message value from each object item,
 * adds it to a new object with the key and value pair
 * @param {object} complexObject { email: { message: 'Email Invalid', status: 400 }}
 * @returns {object} simpleObject { email: 'Email Invalid' };
 */
const getMessageValue = (complexObject) => {
  if (!complexObject) return 'Argument cannot be empty';
  if (!isPlainObject(complexObject)) return 'Argument must be an object';
  const simpleObject = {};
  // get error message and format properly
  Object.keys(complexObject).forEach((obj) => {
    simpleObject[obj] = complexObject[obj].message;
  });

  return simpleObject;
};

/**
 * Beautifies the date param passed
 * @param {String|Date|Number} Date representation in String, Date or Number
 *
 * @returns {String} Monday, 21 September 2018
 */
const beautifyDate = (date) => {
  const d = new Date(date);
  if (d.toString() === 'Invalid Date') return null;
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export {
  getMessageValue,
  beautifyDate,
};
