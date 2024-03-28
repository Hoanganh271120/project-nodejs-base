import compression from 'compression';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import passport from 'passport';
import { errorConverter, errorResponseHandler } from './middlewares/error.js';
import router from './routes/v1/index.route.js';
import { GlobalConfig } from './shared/config/globalConfig.js';
import morgan from './shared/config/morgan.js';
import { jwtStrategy } from './shared/config/passport.js';
import { ErrorCode, ErrorMessage } from './shared/constants/error.constant.js';
import { CustomError } from './utils/custom-error.js';
export const app = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

// set security HTTP headers
app.use(helmet());
// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

// gzip compression
app.use(compression());

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// enable cors
app.use(cors());
app.options('*', cors());

app.get('/health', function (req, res) {
  res.send('Service is up!!!');
});

app.use(GlobalConfig.baseName, router);

app.use((req, res, next) => {
  next(new CustomError({ code: ErrorCode.ROUTE_NOT_FOUND, message: ErrorMessage.ROUTE_NOT_FOUND }));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorResponseHandler);
