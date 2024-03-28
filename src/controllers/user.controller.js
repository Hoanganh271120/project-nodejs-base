import httpStatus from 'http-status';
import userService from '../services/user.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { pick } from '../utils/pick.js';

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = asyncHandler(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

export default {
  createUser,
  getUsers,
};
