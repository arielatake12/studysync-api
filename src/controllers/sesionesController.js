// src/controllers/sesionesController.js
// Migrado a Supabase mediante Prisma ORM - UPDS 2026

// Importamos PrismaClient desde la versión estable que instalamos (Prisma 5)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importamos el cliente de publicación Redis (Paso 4)
const { pub } = require('../redis/client');

// Función auxiliar para asegurar que exista al menos un usuario en Supabase (para evitar fallos de FK)
const asegurarUsuarioPorDefecto = async () => {
  const usuario = await prisma.usuario.findFirst();
  if (usuario) return usuario.id;

  // Si no hay usuarios en la base de datos, creamos uno base temporal
  const nuevoUsuario = await prisma.usuario.create({
    data: {
      nombre: "Estudiante UPDS",
      email: "estudiante@upds.net",
      password: "password_seguro_123"
    }
  });
  return nuevoUsuario.id;
};

// ── GET /api/sesiones ─────────────────────────────────────────────────────────
// PASO 3: Reemplazar el arreglo por prisma.sesion.findMany()
const listar = async (req, res) => {
  try {
    const datos = await prisma.sesion.findMany({
      include: { autor: true } // Trae los datos del usuario que la creó
    });
    
    res.json({
      ok: true,
      total: datos.length,
      datos: datos
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las sesiones de Supabase', detalle: error.message });
  }
};

// ── GET /api/sesiones/:id ─────────────────────────────────────────────────────
// Obtener una sesión individual buscando por ID real en PostgreSQL
const obtenerUna = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const sesion = await prisma.sesion.findUnique({
      where: { id: id },
      include: { autor: true }
    });

    if (!sesion) {
      return res.status(404).json({ error: `Sesión ${id} no encontrada en la base de datos` });
    }
    res.json(sesion);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar la sesión', detalle: error.message });
  }
};

// ── POST /api/sesiones ────────────────────────────────────────────────────────
// PASO 3 & PASO 4: Guardar en Supabase y publicar evento real en Redis
const crear = async (req, res) => {
  try {
    const { titulo, descripcion, materia } = req.body;

    if (!titulo || titulo.trim() === '') {
      return res.status(400).json({
        error: 'El campo titulo es obligatorio',
        campos_requeridos: ['titulo']
      });
    }

    // Aseguramos que tengamos un autor_id válido para cumplir la relación de base de datos
    const autorIdValido = await asegurarUsuarioPorDefecto();

    // Guardamos de forma real en Supabase usando Prisma
    const nuevaSesion = await prisma.sesion.create({
      data: {
        titulo: titulo.trim(),
        descripcion: descripcion || '',
        materia: materia || 'General',
        completada: false,
        autorId: autorIdValido
      }
    });

    // PASO 4: Publicamos el evento en Redis usando los datos reales de Supabase
    await pub.publish('study:sesion:creada', JSON.stringify({
      tipo: 'sesion:creada',
      payload: nuevaSesion,
      timestamp: new Date().toISOString()
    }));
    console.log('[Redis] ✓ Evento publicado: sesion:creada desde Supabase →', nuevaSesion.titulo);

    res.status(201).json(nuevaSesion);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el registro en Supabase', detalle: error.message });
  }
};

// ── PUT /api/sesiones/:id ─────────────────────────────────────────────────────
// PASO 3: Modificar registro mediante prisma.sesion.update()
const actualizar = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { titulo, descripcion, materia, completada } = req.body;

    // Verificamos si existe antes de actualizar
    const existe = await prisma.sesion.findUnique({ where: { id: id } });
    if (!existe) {
      return res.status(404).json({ error: `Sesión ${id} no encontrada` });
    }

    const sesionActualizada = await prisma.sesion.update({
      where: { id: id },
      data: {
        titulo: titulo ? titulo.trim() : undefined,
        descripcion: descripcion !== undefined ? descripcion : undefined,
        materia: materia !== undefined ? materia : undefined,
        completada: completada !== undefined ? completada : undefined
      }
    });

    res.json(sesionActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar en Supabase', detalle: error.message });
  }
};

// ── DELETE /api/sesiones/:id ──────────────────────────────────────────────────
// PASO 3: Eliminar físicamente el registro con prisma.sesion.delete()
const eliminar = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existe = await prisma.sesion.findUnique({ where: { id: id } });
    if (!existe) {
      return res.status(404).json({ error: `Sesión ${id} no encontrada` });
    }

    await prisma.sesion.delete({ where: { id: id } });

    res.json({ ok: true, mensaje: `Sesión ${id} eliminada correctamente de Supabase` });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar de Supabase', detalle: error.message });
  }
};

// ── GET /api/sesiones/materia/:materia ────────────────────────────────────────
// Filtro avanzado buscando directo en la base de datos con "equals" insensible a mayúsculas
const filtrarPorMateria = async (req, res) => {
  try {
    const materiaBuscada = req.params.materia;

    const filtradas = await prisma.sesion.findMany({
      where: {
        materia: {
          equals: materiaBuscada,
          mode: 'insensitive' // No importa si escriben 'general' o 'GENERAL'
        }
      }
    });

    res.json({
      ok: true,
      total: filtradas.length,
      materia: materiaBuscada,
      datos: filtradas
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al filtrar por materia', detalle: error.message });
  }
};

// ── POST /api/sesiones/:id/unirse ─────────────────────────────────────────────
// Lógica para eventos en Redis (Como no hay tabla intermedia de participantes en la consigna básica, 
// disparamos el evento directo en Upstash mapeando el registro)
const unirseSesion = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { estudiante } = req.body;

    if (!estudiante || estudiante.trim() === '') {
      return res.status(400).json({ error: 'El campo estudiante es obligatorio en el body' });
    }

    const sesion = await prisma.sesion.findUnique({ where: { id: id } });
    if (!sesion) {
      return res.status(404).json({ error: `Sesión ${id} no encontrada` });
    }

    await pub.publish('study:usuario:unido', JSON.stringify({
      tipo: 'usuario:unido',
      payload: { sesionId: id, estudiante: estudiante.trim() },
      timestamp: new Date().toISOString()
    }));
    console.log(`[Redis] Evento publicado: usuario:unido → ${estudiante.trim()} en sesión ${id}`);

    res.json({
      ok: true,
      mensaje: `Estudiante ${estudiante.trim()} unido con éxito a la sesión ${id} mediante Redis`
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la unión', detalle: error.message });
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