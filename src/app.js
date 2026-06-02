'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path'); // ✅ AGREGADO (NECESARIO)

const app = express();

// ─────────────────────────────
// 🛡️ SEGURIDAD HTTP (OWASP BASE)
// ─────────────────────────────
app.use(helmet());
app.disable('x-powered-by');

// ─────────────────────────────
// 🚦 RATE LIMIT GLOBAL (ANTI-ATAQUES)
// ─────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo de requests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiadas peticiones, intenta más tarde (429)'
  }
}));

// ─────────────────────────────
// 🌐 CORS (LOCAL + PRODUCCIÓN)
// ─────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://studysync-api-2ah6.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ─────────────────────────────
// 📦 BODY PARSERS
// ─────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────
// 📁 FRONTEND STATIC (✔ CORREGIDO)
// ─────────────────────────────
app.use(express.static(path.join(__dirname, '../public')));

// ─────────────────────────────
// 📚 SWAGGER UI
// ─────────────────────────────
const { swaggerUi, swaggerSpec } = require('./swagger/config');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true
  }
}));

// ─────────────────────────────
// 🔌 RUTAS PRINCIPALES
// ─────────────────────────────
app.use('/auth', require('./routes/auth'));
app.use('/api/sesiones', require('./routes/sesiones'));

// ─────────────────────────────
// 🧪 HEALTH CHECK
// ─────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'StudySync API funcionando 🚀',
    swagger: '/api-docs'
  });
});

// ─────────────────────────────
// 🚨 ERROR HANDLER GLOBAL
// ─────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('❌ ERROR:', err.stack);

  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

module.exports = app;