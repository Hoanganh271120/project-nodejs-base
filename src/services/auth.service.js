import { ErrorMessage } from '../shared/constants/error.constant.js';
import { CustomError } from '../utils/custom-error.js';
import { userService } from './index.service.js';

/**
 * Login with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithUsernameAndPassword = async (username, password) => {
  const user = await userService.getUserByUsername(username);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new CustomError({ code: ErrorCode.LOGIN_FAILED, message: ErrorMessage.LOGIN_FAILED });
  }
  return user;
};

export default {
  loginUserWithUsernameAndPassword,
};
