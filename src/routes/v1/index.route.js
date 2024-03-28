import express from 'express';
import authRoute from './auth.route.js';
import gameRoute from './game.route.js';
import userRoute from './user.route.js';
import swaggerRoute from './swagger.route.js';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/game',
    route: gameRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/api-docs',
    route: swaggerRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
