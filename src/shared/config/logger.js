import * as winston from 'winston';
import { APP_ENV } from '../constants/app.constant.js';
import { GlobalConfig } from './globalConfig.js';

export const logger = winston.createLogger({
  level: GlobalConfig.env === APP_ENV.DEV ? 'debug' : 'info',
  format: winston.format.combine(
    GlobalConfig.env === APP_ENV.DEV ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`),
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});
