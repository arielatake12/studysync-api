// src/app.js
// Este archivo configura Express: middlewares, rutas y manejo de errores
require('dotenv').config();
const express = require('express');
const app = express();

// ─────────────────────────────────────────────────────────────────
// ✨ NUEVO: Importar Swagger (estas líneas se agregan aquí)
// ─────────────────────────────────────────────────────────────────
const swaggerUi   = require('swagger-ui-express');  // La interfaz web visual 
const swaggerSpec = require('./swagger/config');     // La configuración que creaste 

// ── MIDDLEWARES GLOBALES ──────────────────────────────────────────────────────
// express.json() permite leer el body de las peticiones POST/PUT en formato JSON
// Sin este middleware, req.body siempre sería undefined
app.use(express.json());

// Servir archivos estáticos desde la carpeta public (Paso 8 - Sockets)
app.use(express.static('public'));

// Middleware de logs: muestra en consola cada petición que llega
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().substring(11, 19);
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next(); // Pasar al siguiente middleware o ruta
});

// ── RUTAS ─────────────────────────────────────────────────────────────────────
// Ruta raíz: verifica que el servidor funciona
app.get('/', (req, res) => {
  res.json({
    mensaje: 'StudySync API funcionando',
    version: '1.0.0',
    endpoints: ['/api/sesiones', '/auth/register', '/auth/login', '/api-docs']
  });
});

// Conexión del enrutador de sesiones (Agregado en el Paso 4)
const sesionesRouter = require('./routes/sesiones');
app.use('/api/sesiones', sesionesRouter);

// La ruta /auth se agrega en el Paso 9 (JWT)
// app.use('/auth', require('./routes/auth'));

// ─────────────────────────────────────────────────────────────────
// ✨ NUEVO: Montar Swagger en la ruta /api-docs 
// IMPORTANTE: Debe ir DESPUÉS de las rutas de la API pero ANTES del error handler
// ─────────────────────────────────────────────────────────────────
app.use('/api-docs', 
    swaggerUi.serve,          // Sirve los archivos CSS/JS de la interfaz Swagger 
    swaggerUi.setup(swaggerSpec, { 
      customSiteTitle: 'StudySync API Docs',
      swaggerOptions: { 
        persistAuthorization: true  // Guarda el token aunque recargues la página 
      } 
    }) 
); 

// ── MANEJO DE ERRORES GLOBAL ──────────────────────────────────────────────────
// Este middleware de 4 parámetros SIEMPRE va AL FINAL de todo
// Captura cualquier error que haya ocurrido en las rutas anteriores
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    timestamp: new Date().toISOString(),
    ruta: req.path
  });
});

module.exports = app;