'use strict';

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// ─────────────────────────────
// 🌐 BASE URL (LOCAL vs PRODUCCIÓN)
// ─────────────────────────────
const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://studysync-api-2ah6.onrender.com'
    : 'http://localhost:3000';

// ─────────────────────────────
// 📚 SWAGGER SPEC
// ─────────────────────────────
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

    // ─────────────────────────────
    // 🌐 SERVIDORES
    // ─────────────────────────────
    servers: [
      {
        url: BASE_URL,
        description:
          process.env.NODE_ENV === 'production'
            ? 'Producción (Render)'
            : 'Desarrollo local'
      }
    ],

    // ─────────────────────────────
    // 🔐 SEGURIDAD JWT
    // ─────────────────────────────
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },

      // ─────────────────────────────
      // 📦 MODELOS
      // ─────────────────────────────
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

    // 🔐 JWT GLOBAL
    security: [{ BearerAuth: [] }]
  },

  apis: ['./src/routes/*.js']
});

// ─────────────────────────────
// 📤 EXPORT
// ─────────────────────────────
module.exports = { swaggerUi, swaggerSpec };