// src/app.js — CON SWAGGER + CORS AGREGADO
require('dotenv').config();
const express = require('express');
const app = express();

// ── Swagger (Importación de la configuración) ───────────────────────────
const swaggerUi   = require('swagger-ui-express');
const swaggerSpec = require('./swagger/config');

// ── ✨ NUEVO: CORS ────────────────────────────────────────────────
const cors = require('cors');

// Configurar CORS — quién puede hacer peticiones a esta API
app.use(cors({
  // En desarrollo/pruebas locales puedes usar '*' para no renegar, 
  // pero la guía de tu docente pide esta lista explícita para producción:
  origin: [
    'http://localhost:5173',           // Vite en desarrollo local
    'http://localhost:3000',           // Por si el frontend y backend corren juntos
    'https://studysync.vercel.app',    // Frontend en producción (ajustar si tienes el tuyo)
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Authorization lleva tu token JWT
  credentials: true
}));
// ─────────────────────────────────────────────────────────────────

// ── MIDDLEWARES GLOBALES ──────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static('public'));

// Middleware de logs: muestra en consola cada petición que llega
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
    endpoints: ['/api/sesiones', '/auth/register', '/auth/login', '/api-docs']
  });
});

// Conexión del enrutador de sesiones
const sesionesRouter = require('./routes/sesiones');
app.use('/api/sesiones', sesionesRouter);

// ── SWAGGER UI ─────────────────────────────────────────────────────────
app.use('/api-docs', 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'StudySync API Docs',
    swaggerOptions: { persistAuthorization: true }
  })
);

// ── MANEJO DE ERRORES GLOBAL (Siempre al final) ────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    timestamp: new Date().toISOString(),
    ruta: req.path
  });
});

module.exports = app;