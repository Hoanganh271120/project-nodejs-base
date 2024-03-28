import Joi from 'joi';
import { ErrorCode } from '../shared/constants/error.constant.js';
import { CustomError } from '../utils/custom-error.js';
import { pick } from '../utils/pick.js';

export const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema).prefs({ abortEarly: false }).validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new CustomError({ code: ErrorCode.VALIDATION_FAILED, message: errorMessage }));
  }
  Object.assign(req, value);
  return next();
};
