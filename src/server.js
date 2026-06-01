'use strict';

const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
  override: true
});

const app = require('./app');
const socketHandler = require('./socket/socket');

// ─────────────────────────────
// 🔥 REDIS SAFE LOAD
// ─────────────────────────────
let redis = null;

try {
  redis = require('./redis/client');
  console.log('✓ Redis module cargado');
} catch (err) {
  console.warn('⚠️ Redis desactivado (modo offline)');
}

// ─────────────────────────────
// 🌐 HTTP SERVER
// ─────────────────────────────
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// ─────────────────────────────
// 🔌 SOCKET.IO
// ─────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"]
  }
});

// ─────────────────────────────
// 🔐 JWT SOCKET AUTH
// ─────────────────────────────
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Token requerido"));
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;
    next();
  } catch (err) {
    return next(new Error("No autorizado"));
  }
});

// ─────────────────────────────
// 📡 SOCKET HANDLER
// ─────────────────────────────
socketHandler(io, redis);

// ─────────────────────────────
// 🌐 GLOBALS
// ─────────────────────────────
global.io = io;
global.redis = redis;

// ─────────────────────────────
// 🧪 DEBUG (solo local)
// ─────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  console.log("🔥 REDIS_URL =", process.env.REDIS_URL);
}

// ─────────────────────────────
// 🚀 START SERVER (FIX RENDER)
// ─────────────────────────────
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});