'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// ─────────────────────────────────────────────
// 🛡️ SEGURIDAD HTTP (PRIMERO SIEMPRE)
// ─────────────────────────────────────────────
app.use(helmet());

// opcional: ocultar Express (mejor práctica)
app.disable('x-powered-by');

// ─────────────────────────────────────────────
// 🚦 RATE LIMIT GLOBAL (BÁSICO SEGURIDAD API)
// ─────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // límite global
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiadas peticiones, intenta más tarde (429)'
  }
}));

// ─────────────────────────────────────────────
// 🌐 CORS
// ─────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// ─────────────────────────────────────────────
// 📦 BODY PARSERS
// ─────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────
// 📚 SWAGGER
// ─────────────────────────────────────────────
const { swaggerUi, swaggerSpec } = require('./swagger/config');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true
  }
}));

// ─────────────────────────────────────────────
// 🔌 RUTAS
// ─────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const sesionesRoutes = require('./routes/sesiones');

app.use('/auth', authRoutes);
app.use('/api/sesiones', sesionesRoutes);

// ─────────────────────────────────────────────
// 🧪 HEALTH CHECK
// ─────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'StudySync API funcionando 🚀'
  });
});

// ─────────────────────────────────────────────
// 🚨 ERROR HANDLER GLOBAL
// ─────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err);

  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

module.exports = app;