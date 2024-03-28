/**
 * Create a new object with property picked from given object
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
export const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});
};
