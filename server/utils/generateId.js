
/**
 * Function to generate id from a given array
 * @param {array} arrayItem
 * @returns {Integer} generated id
 */
const generateId = (arrayItem) => {
  if (!Array.isArray(arrayItem)) {
    return 0;
  }
  return arrayItem.length + 1;
};

export default generateId;
