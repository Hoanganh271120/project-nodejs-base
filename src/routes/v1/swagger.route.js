import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerConfig } from '../../swagger/swaggerConfig.js';

const router = express.Router();

const specs = swaggerJSDoc(swaggerConfig);

router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(specs, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  }),
);

export default router;
