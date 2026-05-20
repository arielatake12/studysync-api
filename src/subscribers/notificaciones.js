// src/subscribers/notificaciones.js
const { sub } = require('../redis/client');

// Escucha canales Redis y retransmite los eventos a los navegadores vía Socket.io
const iniciarSuscripciones = (io) => {
    
    // Suscribirse a TODOS los canales que empiecen con 'study:'
    sub.psubscribe('study:*', (err, count) => {
      if (err) {
        console.error('[Sub] Error al suscribirse:', err.message);
        return;
      }
      console.log(`[Sub] ✓ Escuchando ${count} patrón(es) en Redis...`);
    });

    // Este listener se ejecuta cada vez que llega un mensaje de Redis
    sub.on('pmessage', (pattern, channel, message) => {
      try {
        const evento = JSON.parse(message);
        console.log(`[Sub] Recibido en ${channel}:`, evento.tipo);

        // Emitir el evento a TODOS los navegadores conectados via Socket.io
        io.emit('nuevo-evento', {
          canal: channel,
          ...evento
        });

      } catch (error) {
        console.error('[Sub] Error procesando mensaje:', error.message);
      }
    });
};

module.exports = { iniciarSuscripciones };