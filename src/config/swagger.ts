import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie Database API',
      version: '1.0.0',
      description: 'API documentation for Movie Database application',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
    ],
    components: {
      schemas: {
        Movie: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The movie ID',
            },
            title: {
              type: 'string',
              description: 'The movie title',
            },
            overview: {
              type: 'string',
              description: 'The movie overview',
            },
            posterPath: {
              type: 'string',
              description: 'The path to the movie poster',
            },
            releaseDate: {
              type: 'string',
              format: 'date',
              description: 'The release date of the movie',
            },
            averageRating: {
              type: 'number',
              format: 'float',
              description: 'The average rating of the movie',
            },
            ratingCount: {
              type: 'integer',
              description: 'The number of ratings the movie has received',
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
