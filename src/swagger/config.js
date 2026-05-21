// src/swagger/config.js
const swaggerJsdoc = require('swagger-jsdoc');

const opciones = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StudySync API',
      version: '1.0.0',
      description:
        'API REST para coordinación de grupos de estudio universitarios. ' +
        'Sistema distribuido con notificaciones en tiempo real via Redis Pub/Sub.',
      contact: {
        name: 'M.Sc. Jimmy Nataniel Requena Llorentty',
        email: 'docente@upds.edu'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Desarrollo local'
      },
      {
        url: 'https://studysync-api-2ah6.onrender.com', // <- Tu URL real de Render
        description: 'Producción (Render)'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresar el token JWT obtenido desde POST /auth/login'
        }
      }
    },
    paths: {
      "/api/sesiones": {
        "get": {
          "summary": "1. Listar todas las sesiones de estudio",
          "tags": ["Sesiones"],
          "responses": { "200": { "description": "Éxito" } }
        },
        "post": {
          "summary": "3. Crear una nueva sesión de estudio",
          "tags": ["Sesiones"],
          "security": [{ "BearerAuth": [] }],
          "responses": { "201": { "description": "Éxito" } }
        }
      },
      "/api/sesiones/{id}": {
        "get": {
          "summary": "2. Obtener una sesión por ID",
          "tags": ["Sesiones"],
          "parameters": [{ "in": "path", "name": "id", "required": true, "schema": { "type": "integer" } }],
          "responses": { "200": { "description": "Éxito" } }
        },
        "put": {
          "summary": "4. Actualizar una sesión existente",
          "tags": ["Sesiones"],
          "security": [{ "BearerAuth": [] }],
          "parameters": [{ "in": "path", "name": "id", "required": true, "schema": { "type": "integer" } }],
          "responses": { "200": { "description": "Éxito" } }
        },
        "delete": {
          "summary": "5. Eliminar una sesión",
          "tags": ["Sesiones"],
          "security": [{ "BearerAuth": [] }],
          "parameters": [{ "in": "path", "name": "id", "required": true, "schema": { "type": "integer" } }],
          "responses": { "200": { "description": "Éxito" } }
        }
      },
      "/api/sesiones/materia/{materia}": {
        "get": {
          "summary": "6. Filtrar sesiones por materia (Defensa Avanzado)",
          "tags": ["Sesiones Avanzadas"],
          "parameters": [{ "in": "path", "name": "materia", "required": true, "schema": { "type": "string" } }],
          "responses": { "200": { "description": "Éxito" } }
        }
      },
      "/api/sesiones/{id}/unirse": {
        "post": {
          "summary": "7. Unirse a una sesión activa (Defensa Avanzado)",
          "tags": ["Sesiones Avanzadas"],
          "security": [{ "BearerAuth": [] }],
          "responses": { "200": { "description": "Éxito" } }
        }
      }
    }
  },
  apis: []
};

module.exports = swaggerJsdoc(opciones);