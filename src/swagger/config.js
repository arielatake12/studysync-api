'use strict';

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'StudySync API',
      version: '1.0.0',
      description:
        'API REST para coordinación de grupos de estudio universitarios.',
      contact: {
        name: 'M.Sc. Jimmy Nataniel Requena Llorentty',
        email: 'docente@upds.edu'
      }
    },

    // 🌐 SERVIDORES (LOCAL + RENDER)
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local'
      },
      {
        url: 'https://studysync-api-2ah6.onrender.com',
        description: 'Producción (Render)'
      }
    ],

    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },

      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Ana García' },
            email: { type: 'string', example: 'ana@upds.edu.bo' },
            creadoEn: { type: 'string', format: 'date-time' }
          }
        },

        Sesion: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            titulo: { type: 'string', example: 'Grupo de Programación IV' },
            descripcion: {
              type: 'string',
              example: 'Resolución de casos de estudio'
            },
            materia: { type: 'string', example: 'Programación' },
            fechaHora: { type: 'string', format: 'date-time' },
            lugar: { type: 'string', example: 'Biblioteca' },
            creadorId: { type: 'integer', example: 1 },
            creadoEn: { type: 'string', format: 'date-time' }
          }
        },

        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Descripción del error' }
          }
        }
      }
    },

    security: [{ BearerAuth: [] }]
  },

  apis: ['./src/routes/*.js']
});

module.exports = { swaggerUi, swaggerSpec };