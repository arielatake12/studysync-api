'use strict';

const { sub } = require('../redis/client');

/**
 * Suscripción Redis → Socket.io
 */
const iniciarSuscripciones = (io) => {

  // ─────────────────────────────
  // 🔥 SUSCRIPCIÓN A PATRONES
  // ─────────────────────────────
  sub.psubscribe('study:*', (err, count) => {
    if (err) {
      console.error('[Redis SUB] Error al suscribirse:', err.message);
      return;
    }
    console.log(`[Redis SUB] ✓ Escuchando ${count} patrón(es)`);
  });

  // ─────────────────────────────
  // 📡 RECEPCIÓN DE MENSAJES
  // ─────────────────────────────
  sub.on('pmessage', (pattern, channel, message) => {
    try {

      // 🔐 seguridad: evitar crash si mensaje no es JSON válido
      let evento;

      try {
        evento = JSON.parse(message);
      } catch (e) {
        console.warn('[Redis SUB] Mensaje no JSON ignorado:', message);
        return;
      }

      console.log(`[Redis SUB] ${channel}:`, evento?.tipo || 'sin-tipo');

      // ─────────────────────────────
      // 📡 EMIT A SOCKET.IO
      // ─────────────────────────────
      io.emit('nuevo-evento', {
        canal: channel,
        ...evento
      });

    } catch (error) {
      console.error('[Redis SUB] Error procesando evento:', error.message);
    }
  });

  // ─────────────────────────────
  // 🚨 MANEJO DE ERRORES REDIS
  // ─────────────────────────────
  sub.on('error', (err) => {
    console.error('[Redis SUB] Error conexión:', err.message);
  });

};

module.exports = { iniciarSuscripciones };