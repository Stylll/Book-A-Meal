import { isPlainObject, isEmpty } from 'lodash';
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
/* eslint-disable import/prefer-default-export */
export { getMessageValue };