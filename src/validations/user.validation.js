import Joi from 'joi';
import { ROLE_ENUM } from '../shared/config/roles.js';
import { password } from './custom.validation.js';

const createUser = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required().custom(password),
    role: Joi.string().required().valid(ROLE_ENUM.USER, ROLE_ENUM.ADMIN),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export default {
  createUser,
  getUsers,
};
