// src/app.js
// Este archivo configura Express: middlewares, rutas y manejo de errores
require('dotenv').config();
const express = require('express');
const app = express();

// ─────────────────────────────────────────────────────────────────
// ✨ Importar Swagger 
// ─────────────────────────────────────────────────────────────────
const swaggerUi   = require('swagger-ui-express');  // La interfaz web visual 
const swaggerSpec = require('./swagger/config');     // La configuración que creaste 

// ── MIDDLEWARES GLOBALES ──────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static('public'));

// Middleware de logs
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().substring(11, 19);
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ── RUTAS ─────────────────────────────────────────────────────────────────────
// Ruta raíz: verifica que el servidor funciona
app.get('/', (req, res) => {
  res.json({
    mensaje: 'StudySync API funcionando',
    version: '1.0.0',
    endpoints: ['/api/sesiones', '/api-docs']
  });
});

// Conexión del enrutador de sesiones
const sesionesRouter = require('./routes/sesiones');
app.use('/api/sesiones', sesionesRouter);

// ─────────────────────────────────────────────────────────────────
// ✨ Montar Swagger en la ruta /api-docs 
// ─────────────────────────────────────────────────────────────────
app.use('/api-docs', 
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { 
      customSiteTitle: 'StudySync API Docs',
      swaggerOptions: { 
        persistAuthorization: true
      } 
    }) 
); 

// ── MANEJO DE ERRORES GLOBAL ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    timestamp: new Date().toISOString(),
    ruta: req.path
  });
});

module.exports = app;