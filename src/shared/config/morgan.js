import httpStatus from 'http-status';
import morgan from 'morgan';
import { APP_ENV } from '../constants/app.constant.js';
import { GlobalConfig } from './globalConfig.js';
import { logger } from './logger.js';

morgan.token('message', (req, res) => res.locals.errorMessage || '');

const getIpFormat = () => (GlobalConfig.env === APP_ENV.PROD ? ':remote-addr - ' : '');

const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= httpStatus.BAD_REQUEST,
  stream: { write: (message) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < httpStatus.BAD_REQUEST,
  stream: { write: (message) => logger.error(message.trim()) },
});

export default { successHandler, errorHandler };
