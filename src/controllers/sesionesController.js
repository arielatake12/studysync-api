'use strict';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─────────────────────────────
// 📄 LISTAR SESIONES
// ─────────────────────────────
const listar = async (req, res) => {
  try {
    const sesiones = await prisma.sesion.findMany();
    return res.json(sesiones);
  } catch (err) {
    console.error("❌ LISTAR ERROR:", err);
    return res.status(500).json({ error: "Error al listar sesiones" });
  }
};

// ─────────────────────────────
// 📄 OBTENER UNA SESIÓN
// ─────────────────────────────
const obtenerUna = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const sesion = await prisma.sesion.findUnique({
      where: { id }
    });

    if (!sesion) {
      return res.status(404).json({ error: "Sesión no encontrada" });
    }

    return res.json(sesion);
  } catch (err) {
    console.error("❌ OBTENER ERROR:", err);
    return res.status(500).json({ error: "Error al obtener sesión" });
  }
};

// ─────────────────────────────
// ➕ CREAR SESIÓN
// ─────────────────────────────
const crear = async (req, res) => {
  try {
    const { titulo, materia, descripcion, fechaHora, lugar } = req.body;

    // 🔐 FIX IMPORTANTE: consistencia req.usuario
    if (!req.usuario?.id) {
      return res.status(401).json({ error: "Token requerido" });
    }

    if (!titulo || !materia || !fechaHora) {
      return res.status(400).json({
        error: "titulo, materia y fechaHora son obligatorios"
      });
    }

    const fecha = new Date(fechaHora);

    if (isNaN(fecha.getTime())) {
      return res.status(400).json({
        error: "fechaHora inválida"
      });
    }

    const sesion = await prisma.sesion.create({
      data: {
        titulo,
        materia,
        descripcion: descripcion ?? null,
        fechaHora: fecha,
        lugar: lugar ?? null,
        creadorId: req.usuario.id
      }
    });

    return res.status(201).json(sesion);

  } catch (err) {
    console.error("❌ CREAR ERROR:", err);
    return res.status(500).json({
      error: "Error al crear sesión",
      detalle: err.message
    });
  }
};

// ─────────────────────────────
// ✏️ ACTUALIZAR
// ─────────────────────────────
const actualizar = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existe = await prisma.sesion.findUnique({
      where: { id }
    });

    if (!existe) {
      return res.status(404).json({ error: "Sesión no encontrada" });
    }

    const updated = await prisma.sesion.update({
      where: { id },
      data: {
        ...req.body
      }
    });

    return res.json(updated);

  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);
    return res.status(500).json({ error: "Error al actualizar sesión" });
  }
};

// ─────────────────────────────
// ❌ ELIMINAR
// ─────────────────────────────
const eliminar = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existe = await prisma.sesion.findUnique({
      where: { id }
    });

    if (!existe) {
      return res.status(404).json({ error: "Sesión no encontrada" });
    }

    await prisma.sesion.delete({
      where: { id }
    });

    return res.json({ mensaje: "Eliminado correctamente" });

  } catch (err) {
    console.error("❌ DELETE ERROR:", err);
    return res.status(500).json({ error: "Error al eliminar sesión" });
  }
};

// ─────────────────────────────
// 🔍 FILTRAR
// ─────────────────────────────
const filtrarPorMateria = async (req, res) => {
  try {
    const { materia } = req.params;

    const sesiones = await prisma.sesion.findMany({
      where: { materia }
    });

    return res.json(sesiones);

  } catch (err) {
    console.error("❌ FILTRO ERROR:", err);
    return res.status(500).json({ error: "Error al filtrar sesiones" });
  }
};

// ─────────────────────────────
// 🔥 UNIRSE (SOCKET SEGURO)
// ─────────────────────────────
const unirseSesion = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!req.usuario?.email) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const sesion = await prisma.sesion.findUnique({
      where: { id }
    });

    if (!sesion) {
      return res.status(404).json({ error: "Sesión no encontrada" });
    }

    // 🔥 FIX: evitar crash si socket no existe
    if (global.io) {
      global.io.to(`sesion_${id}`).emit('sesion:actividad', {
        message: `${req.usuario.email} se unió`,
        sesionId: id,
        user: req.usuario.email
      });
    }

    return res.json({
      message: "OK",
      sesionId: id
    });

  } catch (err) {
    console.error("❌ SOCKET ERROR:", err);
    return res.status(500).json({ error: "Error al unirse a sesión" });
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