'use strict';

const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

require('dotenv').config(); // ✔ FIX IMPORTANTE (Render compatible)

const app = require('./app');
const socketHandler = require('./socket/socket');

// ─────────────────────────────
// 🔐 VALIDACIÓN CRÍTICA
// ─────────────────────────────
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET no definido");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL no definido");
  process.exit(1);
}

// ─────────────────────────────
// 🔥 REDIS (SAFE LOAD)
// ─────────────────────────────
let redis = null;

try {
  redis = require('./redis/client');
  console.log('✓ Redis cargado');
} catch (err) {
  console.warn('⚠️ Redis desactivado (modo offline)');
}

// ─────────────────────────────
// 🌐 HTTP SERVER
// ─────────────────────────────
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// ─────────────────────────────
// 🔌 SOCKET.IO CONFIG
// ─────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// ─────────────────────────────
// 🔐 JWT AUTH SOCKET
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
// 📡 DEBUG CONEXIONES (DEFENSA)
// ─────────────────────────────
io.on("connection", (socket) => {
  console.log(`🔌 Usuario conectado: ${socket.user.email}`);

  socket.on("disconnect", () => {
    console.log(`❌ Usuario desconectado: ${socket.user.email}`);
  });
});

// ─────────────────────────────
// 📡 LOGICA SOCKET (SESIONES / EVENTOS)
// ─────────────────────────────
socketHandler(io, redis);

// ─────────────────────────────
// 🌐 GLOBAL ACCESS
// ─────────────────────────────
global.io = io;
global.redis = redis;

// ─────────────────────────────
// 🧪 DEBUG INICIAL (MUY ÚTIL EN RENDER)
// ─────────────────────────────
console.log("🚀 SERVER INICIANDO...");
console.log("DB:", process.env.DATABASE_URL ? "OK" : "MISSING");
console.log("JWT:", process.env.JWT_SECRET ? "OK" : "MISSING");

// ─────────────────────────────
// 🚀 START SERVER (RENDER FIX)
// ─────────────────────────────
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});