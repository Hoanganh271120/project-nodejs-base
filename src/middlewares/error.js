import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { GlobalConfig } from '../shared/config/globalConfig.js';
import { logger } from '../shared/config/logger.js';
import { APP_ENV } from '../shared/constants/app.constant.js';
import { CustomError } from '../utils/custom-error.js';

export const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof CustomError)) {
    const code =
      error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new CustomError({ code, message }, false, err.stack);
  }
  next(error);
};

export const errorResponseHandler = (err, req, res, next) => {
  let { code, message, data } = err;
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  if (GlobalConfig.env === APP_ENV.PROD && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }
  // eslint-disable-next-line no-magic-numbers
  statusCode = parseInt(code / 1000); //From internal code with 6 digits we get first 3 digits as HttpStatusCode
  res.locals.errorMessage = err.message;

  const errorResponse = {
    code,
    message,
    data,
    ...(GlobalConfig.env === APP_ENV.DEV && { stack: err.stack }),
  };

  if (GlobalConfig.env === APP_ENV.DEV) {
    logger.error(err);
  }

  res.status(statusCode).send(errorResponse);
};
