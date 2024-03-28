import httpStatus from 'http-status';
import { authService, tokenService, userService } from '../services/index.service.js';
import { asyncHandler } from '../utils/async-handler.js';

const register = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.loginUserWithUsernameAndPassword(username, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

export default { register, login };
