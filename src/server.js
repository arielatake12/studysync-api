// src/server.js
// Punto de entrada principal — inicia el servidor HTTP con Socket.io + Redis
require('dotenv').config();
const http = require('http');                  // 🛠️ AGREGADO: Módulo HTTP nativo
const { Server } = require('socket.io');       // 🛠️ AGREGADO: Motor de WebSockets
const app = require('./app');
const PORT = process.env.PORT || 3000;

// 🛠️ AGREGADO: Crear servidor HTTP y montar Socket.io sobre él
const servidor = http.createServer(app);
const io = new Server(servidor, {
  cors: { origin: '*' },
  transports: ['polling', 'websocket']
});

// 🛠️ AGREGADO: Inicializar tuscriptores Redis pasándole la instancia 'io'
const { iniciarSuscripciones } = require('./subscribers/notificaciones');
iniciarSuscripciones(io);

// 🛠️ AGREGADO: Manejar conexiones básicas de los navegadores por consola
io.on('connection', (socket) => {
  console.log(`[WS] Cliente conectado: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[WS] Cliente desconectado: ${socket.id}`);
  });
});

// 🚀 MODIFICADO: Ahora escuchamos desde 'servidor', no desde 'app'
servidor.listen(PORT, () => {
  console.log('═══════════════════════════════════════════');
  console.log(` StudySync API + WebSocket · http://localhost:${PORT}`);
  console.log(` /api/sesiones   /auth   /api-docs`);
  console.log('═══════════════════════════════════════════');
});