
/**
 * Function to generate id from a given array
 * @param {array} arrItem
 * @returns {Integer} generated id
 */
const generateId = (arrItem) => {
  if (!Array.isArray(arrItem)) {
    return 0;
  }
  return arrItem.length + 1;
};

export default generateId;
