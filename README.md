# RAZER ASSESSMENT API

A project for Razer technical assessment.

This project provide APIs that manage users and games of a company.

## Prerequisites

- Node version >= 18
- Docker

## Installation

Follow these step to install and run this application locally:

Clone the repo:

```bash
git clone --depth 1 https://github.com/vuongthanh148/razer_assessment.git
cd razer_assessment
```

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables as below
```

Set the docker compose file:

```bash
cp docker-compose.yaml.example docker-compose.yaml
```

Seed data:

```bash
npm run seed:run
```

Start docker container:

```bash
npm run docker:run
```

Now you can access swagger documentation at: `http://localhost:3000/api/v1/api-docs`

## Table of Contents

- [Features](#features)
- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Validation](#validation)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [Logging](#logging)
- [Custom Mongoose Plugins](#custom-mongoose-plugins)
- [Linting](#linting)
- [Contributing](#contributing)

## Features

- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Authentication and authorization**: using [passport](http://www.passportjs.org)
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)
- **Error handling**: centralized error handling mechanism
- **API documentation**: with [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) and [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
- **Dependency management**: with [NPM](https://www.npmjs.com/)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
- **Santizing**: sanitize request data against xss and query injection
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
- **Docker support**
- **Git hooks**: with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
- **Editor config**: consistent editor configuration using [EditorConfig](https://editorconfig.org)

## Commands

Running locally:

```bash
npm run dev
```

Docker:

```bash
# run docker container
npm run docker:run
```

Linting:

```bash
# run ESLint
npm run lint

# fix ESLint errors
npm run lint:fix

# run prettier
npm run prettier

# fix prettier errors
npm run prettier:fix
```

Seed data:

```bash
npm run seed:run
```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
# Port number
PORT=3000
NODE_ENV=PROD
# URL of the Mongo DB
MONGODB_URL=mongodb://127.0.0.1:27017/razer_assessment
BASE_NAME=/api/v1
# JWT
# JWT secret key
JWT_SECRET=razersecret
# Number of minutes after which an access token expires
JWT_ACCESS_EXPIRATION_MINUTES=60
# Number of days after which a refresh token expires
JWT_REFRESH_EXPIRATION_DAYS=30
```

## Project Structure

```
src\
 |--controllers\    # Route controllers (controller layer)
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--shared\         # Environment variables, constant and configuration related things
 |--swagger\        # Swagger files
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/api/v1/api-docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

### API Endpoints

List of available routes:

**Auth routes**:\
`POST /api/v1/auth/register` - register\
`POST /api/v1/auth/login` - login\

**User routes**:\
`POST /api/v1/user` - create a user\
`GET /api/v1/user` - get all users\

**Game routes**:\
`POST /api/v1/game` - create a game\
`GET /api/v1/game` - get all games\
`GET /api/v1/game/:gameId` - get game by id\
`PATCH /api/v1/game/:gameId` - update game by id\
`DELETE /api/v1/game/:gameId` - delete game by id\

## Error Handling

The app has a centralized error handling mechanism.

Controllers should try to catch the errors and forward them to the error handling middleware (by calling `next(error)`). For convenience, we can also wrap the controller inside the `asyncHandler` utility wrapper, which forwards the error.

```javascript
/* auth.controller.js */
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.loginUserWithUsernameAndPassword(username, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});
```

The error handling middleware sends an error response, which has the following format:

```json
{
  "code": 401000,
  "message": "Not found",
  "data": {}
}
```

When running in development mode, the error response also contains the error stack.

The app has a utility `CustomError` class to which you can attach a response custom code, message and data. Then throw it from anywhere (`asyncHandler` will catch and handle it).

For example, if you are trying to create an user that already exist in DB, and you want to send a custom error, the code should look something like:

```javascript
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
```

## Validation

Request data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the `src/validations` directory and are used in the routes by providing them as parameters to the `src/middlewares/validate` middleware.

```javascript
/* game.validation.js */
const createGame = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    category: Joi.array()
      .items(Joi.string().valid(...CATEGORY_ENUM))
      .default([])
      .single(),
    genre: Joi.array()
      .items(Joi.string().valid(...GENRE_ENUM))
      .default([])
      .single(),
    platform: Joi.array()
      .items(Joi.string().valid(...PLATFORM_ENUM))
      .default([])
      .single(),
    thumbnail: Joi.string(),
  }),
};

const queryGame = {
  params: Joi.object().keys({
    gameId: Joi.string().custom(objectId),
  }),
};
```

## Authentication

To require authentication for certain routes, you can use the `auth` middleware.

```javascript
/* user.route.js */
const router = express.Router();

router
  .route('/')
  .post(auth([PERMISSION_ENUM.CREATE_USER]), validate(userValidation.createUser), userController.createUser)
  .get(auth([PERMISSION_ENUM.GET_USER]), validate(userValidation.getUsers), userController.getUsers);

export default router;
```

These routes require a valid JWT access token in the Authorization request header using the Bearer schema. If the request does not contain a valid access token, an Unauthorized (401) error is thrown.

**Generating Access Tokens**:

An access token can be generated by making a successful call to the register (`POST /v1/auth/register`) or login (`POST /v1/auth/login`) endpoints. The response of these endpoints also contains refresh tokens (explained below).

An access token is valid for 30 minutes. You can modify this expiration time by changing the `JWT_ACCESS_EXPIRATION_MINUTES` environment variable in the .env file.

**Refreshing Access Tokens**:

After the access token expires, a new access token can be generated, by making a call to the refresh token endpoint (`POST /v1/auth/refresh-tokens`) and sending along a valid refresh token in the request body. This call returns a new access token and a new refresh token.

A refresh token is valid for 30 days. You can modify this expiration time by changing the `JWT_REFRESH_EXPIRATION_DAYS` environment variable in the .env file.

## Authorization

The `auth` middleware can also be used to require certain rights/permissions to access a route.

```javascript
/* game.route.js */
const router = express.Router();

router
  .route('/')
  .get(auth([PERMISSION_ENUM.GET_GAME]), validate(gameValidation.queryGames), gameController.queryGames)
  .post(auth([PERMISSION_ENUM.CREATE_GAME]), validate(gameValidation.createGame), gameController.createGame);

router
  .route('/:gameId')
  .get(auth([PERMISSION_ENUM.GET_GAME]), validate(gameValidation.queryGame), gameController.queryOneGame)
  .patch(auth([PERMISSION_ENUM.UPDATE_GAME]), validate(gameValidation.updateGame), gameController.updateGame)
  .delete(auth([PERMISSION_ENUM.DELETE_GAME]), validate(gameValidation.deleteGame), gameController.deleteGame);

export default router;
```

In the example above, only authenticated user can access the APIs.

The permissions are also role-based. Only ADMIN have permission to modify the data.
The permissions/rights of each role are set up in the `src/shared/config/roles.js` file.

If the user making the request does not have the required permissions to access this route, a Forbidden (403) error is thrown.

## Logging

Import the logger from `src/shared/config/logger.js`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```javascript
const logger = require('<path to src>/config/logger');

logger.error('message'); // level 0
logger.warn('message'); // level 1
logger.info('message'); // level 2
logger.http('message'); // level 3
logger.verbose('message'); // level 4
logger.debug('message'); // level 5
```

API request information (request url, response code, timestamp, etc..) are also automatically logged using [morgan](https://github.com/expressjs/morgan).

## Custom Mongoose Plugins

The app also contains 2 custom mongoose plugins that you can attach to any mongoose model schema. You can find the plugins in `src/models/plugins`.

```javascript
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const gameSchema = mongoose.Schema(
  {
    /* schema definition here */
  },
  { timestamps: true },
);

gameSchema.plugin(toJSON);
gameSchema.plugin(paginate);

const Game = mongoose.model('Game', gameSchema);
```

### toJSON

The toJSON plugin applies the following changes in the toJSON transform call:

- removes \_\_v, createdAt, updatedAt, and any schema path that has private: true
- replaces \_id with id

### paginate

The paginate plugin adds the `paginate` static method to the mongoose schema.

Adding this plugin to the `Game` model schema will allow you to do the query with pagination directly in model as below:

```javascript
/**
 * Query for games
 * @param {Object} filter - Mongo filter
 * @param {Option} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryGames = async (filter, options) => {
  const game = await Game.paginate(filter, options);
  if (!game) throw new CustomError({ code: ErrorCode.GAME_SEARCH_FAILED, message: ErrorMessage.GAME_SEARCH_FAILED });
  return game;
};
```

The `filter` param is a regular mongo filter.

The `options` param can have the following (optional) fields:

```javascript
const options = {
  sortBy: 'name:desc', // sort order
  limit: 5, // maximum results per page
  page: 2, // page number
};
```

The plugin also supports sorting by multiple criteria (separated by a comma): `sortBy: username:desc,role:asc`

The `paginate` method returns a Promise, which fulfills with an object having the following properties:

```json
{
  "data": [],
  "page": 2,
  "limit": 5,
  "totalPages": 10,
  "totalResults": 48
}
```

## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

In this app, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications. It also extends [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to turn off all rules that are unnecessary or might conflict with Prettier.

To modify the ESLint configuration, update the `.eslintrc.json` file. To modify the Prettier configuration, update the `.prettierrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.

To maintain a consistent coding style across different IDEs, the project contains `.editorconfig`

## References

- [hagopj13/node-express-boilerplate](https://github.com/hagopj13/node-express-boilerplate)
