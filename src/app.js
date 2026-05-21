// src/app.js — VERSIÓN FINAL COMPLETA
// Incluye: Swagger + CORS + Rate Limiting en el orden correcto
require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const rateLimit  = require('express-rate-limit');
const swaggerUi  = require('swagger-ui-express');
const swaggerSpec = require('./swagger/config');

const app = express();

// ════════════════════════════════════════════════════════════════
// 1. CORS — DEBE ser el primer middleware
//    Razón: el navegador verifica CORS antes de procesar la petición.
// ════════════════════════════════════════════════════════════════
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://studysync.vercel.app', // URL del frontend en producción
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ════════════════════════════════════════════════════════════════
// 2. RATE LIMITING — Después de CORS, antes de las rutas
//    ¿Qué hace? Crea un "contador" en memoria por cada IP.
// ════════════════════════════════════════════════════════════════
const limiter = rateLimit({
  // windowMs: la ventana de tiempo en milisegundos (15 minutos)
  windowMs: 15 * 60 * 1000,

  // max: número máximo de peticiones por IP en esa ventana
  max: 100,

  // message: lo que el cliente recibe cuando supera el límite
  message: {
    error: 'Demasiadas peticiones desde esta IP.',
    mensaje: 'Has superado el límite de 100 peticiones en 15 minutos. Intenta nuevamente más tarde.',
    reintentarEn: '15 minutos'
  },

  // standardHeaders: agrega cabeceras RateLimit-* estándar a todas las respuestas
  standardHeaders: true,

  // legacyHeaders: deshabilita las cabeceras X-RateLimit-* antiguas
  legacyHeaders: false,
});

// Aplicar el limiter SOLO a las rutas /api/*
// Razón: no queremos limitar /api-docs ni la ruta raíz /
app.use('/api/', limiter);

// ════════════════════════════════════════════════════════════════
// 3. MIDDLEWARES ESTÁNDAR (sin cambios — ya los tenías)
// ════════════════════════════════════════════════════════════════
app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  const timestamp = new Date().toISOString().substring(11, 19);
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ════════════════════════════════════════════════════════════════
// 4. RUTAS (sin cambios — ya las tenías)
// ════════════════════════════════════════════════════════════════
app.get('/', (req, res) => {
  res.json({
    mensaje: 'StudySync API funcionando',
    version: '1.0.0',
    endpoints: ['/api/sesiones', '/auth/register', '/auth/login', '/api-docs']
  });
});

const sesionesRouter = require('./routes/sesiones');
app.use('/api/sesiones', sesionesRouter);

// ════════════════════════════════════════════════════════════════
// 5. SWAGGER — Después de las rutas de la API
// ════════════════════════════════════════════════════════════════
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'StudySync API Docs',
  swaggerOptions: { persistAuthorization: true }
}));

// ════════════════════════════════════════════════════════════════
// 6. MANEJO DE ERRORES GLOBAL — SIEMPRE AL FINAL
// ════════════════════════════════════════════════════════════════
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    timestamp: new Date().toISOString(),
    ruta: req.path
  });
});

module.exports = app;