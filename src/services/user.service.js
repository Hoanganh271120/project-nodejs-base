import { User } from '../models/user.model.js';
import { ErrorCode, ErrorMessage } from '../shared/constants/error.constant.js';
import { CustomError } from '../utils/custom-error.js';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isUsernameTaken(userBody.username)) {
    throw new CustomError({ code: ErrorCode.USER_NAME_EXIST, message: ErrorMessage.USER_NAME_EXIST });
  }
  return User.create(userBody);
};

/**
 * @typedef {Object} Option
 * @property {string} sortBy - Sort option in the format: sortField:(desc|asc)
 * @property {number} limit - Maximum number of results per page (default = 10)
 * @property {number} page - Current page (default = 1)
 */
/**
 * Query for games
 * @param {Object} filter - Mongo filter
 * @param {Option} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by username
 * @param {string} username
 * @returns {Promise<User>}
 */
const getUserByUsername = async (username) => {
  return User.findOne({ username });
};

export default {
  createUser,
  queryUsers,
  getUserByUsername,
};
