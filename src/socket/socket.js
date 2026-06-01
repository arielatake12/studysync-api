module.exports = (io) => {

  io.on('connection', (socket) => {

    // ─────────────────────────────────────────────
    // 🔐 SEGURIDAD BÁSICA
    // ─────────────────────────────────────────────
    if (!socket.user) {
      console.log('⚠️ Usuario sin auth intentó conectar');
      return socket.disconnect();
    }

    const email = socket.user?.email || 'desconocido';

    console.log(`🟢 Usuario conectado: ${email}`);

    // ─────────────────────────────────────────────
    // 📚 UNIRSE A SESIÓN (ROOM)
    // ─────────────────────────────────────────────
    socket.on('sesion:unirse', (sesionId) => {

      if (!sesionId) {
        console.log("⚠️ sesionId inválido");
        return;
      }

      const room = `sesion_${sesionId}`;

      socket.join(room);

      console.log(`📚 ${email} entró a ${room}`);

      io.to(room).emit('sesion:actividad', {
        message: `${email} se unió a la sesión`,
        sesionId,
        user: email
      });
    });

    // ─────────────────────────────────────────────
    // 💬 MENSAJES EN SESIÓN
    // ─────────────────────────────────────────────
    socket.on('sesion:mensaje', (data) => {

      if (!data || !data.sesionId || !data.message) {
        console.log("⚠️ Mensaje inválido recibido");
        return;
      }

      const room = `sesion_${data.sesionId}`;

      io.to(room).emit('sesion:mensaje', {
        user: email,
        message: data.message,
        time: new Date()
      });

    });

    // ─────────────────────────────────────────────
    // 🔴 DESCONECTAR
    // ─────────────────────────────────────────────
    socket.on('disconnect', () => {
      console.log(`🔴 Usuario desconectado: ${email}`);
    });

  });

};