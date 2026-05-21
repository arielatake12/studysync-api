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
        'Sistema distribuido con notificaciones en tiempo real a través de Redis Pub/Sub.',
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
        url: 'https://studysync-api-2ah6.onrender.com', // Tu URL real de Render
        description: 'Producción (Render)'
      }
    ],
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
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "titulo": { "type": "string", "example": "Exposición de Sistemas Distribuidos" },
                    "materia": { "type": "string", "example": "Programación IV" },
                    "descripcion": { "type": "string", "example": "Repaso general de la arquitectura de la API." },
                    "fechaHora": { "type": "string", "example": "2026-05-25T15:00:00Z" }
                  }
                }
              }
            }
          },
          "responses": { "201": { "description": "Creado con éxito" } }
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
          "parameters": [{ "in": "path", "name": "id", "required": true, "schema": { "type": "integer" } }],
          "responses": { "200": { "description": "Éxito" } }
        },
        "delete": {
          "summary": "5. Eliminar una sesión",
          "tags": ["Sesiones"],
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
          "parameters": [{ "in": "path", "name": "id", "required": true, "schema": { "type": "integer" } }],
          "responses": { "200": { "description": "Éxito" } }
        }
      }
    }
  },
  apis: []
};

module.exports = swaggerJsdoc(opciones);