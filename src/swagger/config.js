// src/swagger/config.js
// ¿Qué hace este archivo?
// swagger-jsdoc lee los comentarios especiales de tus rutas (los @swagger)
// y genera automáticamente un documento JSON con la especificación OpenAPI 3.0.
// Ese documento es el que Swagger UI (la página web) va a renderizar.

const swaggerJsdoc = require('swagger-jsdoc');

const opciones = {
    // 'definition' describe tu API: nombre, versión, descripción y servidores
    definition: {
      openapi: '3.0.0',            // Versión del estándar OpenAPI que usamos
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
      // Servidores donde está disponible la API
      // Swagger permite cambiar entre el servidor local y producción con un menú
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Desarrollo local'
        },
        {
          url: 'https://studysync-api-a5o0.onrender.com',
          description: 'Producción (Render)'
        }
      ],
      // 'components' define elementos reutilizables
      // BearerAuth: le dice a Swagger que esta API usa tokens JWT
      // Cuando el usuario hace clic en "Authorize" e ingresa su token,
      // Swagger lo incluye automáticamente en todas las peticiones que lo requieran
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Ingresar el token JWT obtenido desde POST /auth/login'
          }
        }
      }
    },
    // 'apis' indica dónde buscar los comentarios @swagger
    // El patrón *.js con hace que busque en todas las rutas de src/routes/
    apis: ['./src/routes/*.js']
};

// swagger-jsdoc procesa los archivos indicados en 'apis',
// lee los comentarios @swagger y devuelve un objeto JSON con la especificación
module.exports = swaggerJsdoc(opciones);