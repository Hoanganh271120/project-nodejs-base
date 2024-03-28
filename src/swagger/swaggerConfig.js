import { GlobalConfig } from '../shared/config/globalConfig.js';

export const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Razer Assessment API documentation',
      version: '1.0.0',
      description: 'This is a simple CRUD API application for Razer assessment',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    servers: [
      {
        url: `http://localhost:${GlobalConfig.port}/api/v1`,
      },
    ],
  },
  apis: ['src/swagger/*.yaml', 'src/routes/v1/*.js'],
};
