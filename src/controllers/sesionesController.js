const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { pub } = require('../redis/client'); // opcional futuro

// ─────────────────────────────────────────────
// 📄 LISTAR SESIONES
// ─────────────────────────────────────────────
const listar = async (req, res) => {
  const sesiones = await prisma.sesion.findMany();
  res.json(sesiones);
};

// ─────────────────────────────────────────────
// 📄 OBTENER UNA SESIÓN
// ─────────────────────────────────────────────
const obtenerUna = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const sesion = await prisma.sesion.findUnique({
      where: { id }
    });

    if (!sesion) {
      return res.status(404).json({ error: "Sesión no encontrada" });
    }

    res.json(sesion);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener sesión" });
  }
};

// ─────────────────────────────────────────────
// ➕ CREAR SESIÓN (MEJORADO + JWT)
// ─────────────────────────────────────────────
const crear = async (req, res) => {
  try {
    const { titulo, materia, descripcion, fechaHora, lugar } = req.body;

    if (!titulo || !materia || !fechaHora) {
      return res.status(400).json({
        error: "titulo, materia y fechaHora son obligatorios"
      });
    }

    const sesion = await prisma.sesion.create({
      data: {
        titulo,
        materia,
        descripcion,
        fechaHora: new Date(fechaHora),
        lugar,
        creadorId: req.usuario.id
      }
    });

    res.status(201).json(sesion);

  } catch (err) {
    res.status(500).json({ error: "Error al crear sesión" });
  }
};

// ─────────────────────────────────────────────
// ✏️ ACTUALIZAR SESIÓN (SEGURA)
// ─────────────────────────────────────────────
const actualizar = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const sesion = await prisma.sesion.findUnique({ where: { id } });

    if (!sesion) {
      return res.status(404).json({ error: "Sesión no encontrada" });
    }

    const updated = await prisma.sesion.update({
      where: { id },
      data: req.body
    });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: "Error al actualizar sesión" });
  }
};

// ─────────────────────────────────────────────
// ❌ ELIMINAR SESIÓN (SEGURA)
// ─────────────────────────────────────────────
const eliminar = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const sesion = await prisma.sesion.findUnique({ where: { id } });

    if (!sesion) {
      return res.status(404).json({ error: "Sesión no encontrada" });
    }

    await prisma.sesion.delete({ where: { id } });

    res.json({ mensaje: 'Eliminado' });

  } catch (err) {
    res.status(500).json({ error: "Error al eliminar sesión" });
  }
};

// ─────────────────────────────────────────────
// 🔍 FILTRAR POR MATERIA
// ─────────────────────────────────────────────
const filtrarPorMateria = async (req, res) => {
  try {
    const { materia } = req.params;

    const sesiones = await prisma.sesion.findMany({
      where: { materia }
    });

    res.json(sesiones);

  } catch (err) {
    res.status(500).json({ error: "Error al filtrar sesiones" });
  }
};

// ─────────────────────────────────────────────
// 🔥 UNIRSE A SESIÓN (SOCKET.IO + JWT)
// ─────────────────────────────────────────────
const unirseSesion = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const sesion = await prisma.sesion.findUnique({
      where: { id }
    });

    if (!sesion) {
      return res.status(404).json({ error: "Sesión no encontrada" });
    }

    global.io.to(`sesion_${id}`).emit('sesion:actividad', {
      message: `${req.usuario.email} se unió a la sesión`,
      sesionId: id,
      user: req.usuario.email
    });

    res.json({
      message: "Te uniste a la sesión en tiempo real",
      sesionId: id
    });

  } catch (err) {
    res.status(500).json({ error: "Error al unirse a sesión" });
  }
};

module.exports = {
  listar,
  obtenerUna,
  crear,
  actualizar,
  eliminar,
  filtrarPorMateria,
  unirseSesion
};