'use strict';

const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/sesionesController');
const autenticar = require('../middlewares/autenticar');

// ─────────────────────────────────────────────
// 📌 SESIONES PÚBLICAS
// ─────────────────────────────────────────────

/**
 * @swagger
 * /api/sesiones:
 *   get:
 *     summary: Lista todas las sesiones
 *     tags: [Sesiones]
 *     responses:
 *       200:
 *         description: Lista de sesiones obtenida
 */
router.get('/', ctrl.listar);


/**
 * @swagger
 * /api/sesiones/materia/{materia}:
 *   get:
 *     summary: Filtrar sesiones por materia
 *     tags: [Sesiones]
 *     parameters:
 *       - in: path
 *         name: materia
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sesiones filtradas
 */
router.get('/materia/:materia', ctrl.filtrarPorMateria);


/**
 * @swagger
 * /api/sesiones/{id}:
 *   get:
 *     summary: Obtener sesión por ID
 *     tags: [Sesiones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sesión encontrada
 *       404:
 *         description: No encontrada
 */
router.get('/:id', ctrl.obtenerUna);


// ─────────────────────────────────────────────
// 🔐 SESIONES PROTEGIDAS (JWT)
// ─────────────────────────────────────────────

/**
 * @swagger
 * /api/sesiones:
 *   post:
 *     summary: Crear nueva sesión
 *     tags: [Sesiones]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - materia
 *               - fechaHora
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Estudio Programación IV
 *               materia:
 *                 type: string
 *                 example: Programación IV
 *               fechaHora:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-06-01T10:00:00
 *               descripcion:
 *                 type: string
 *                 example: Repaso general
 *               lugar:
 *                 type: string
 *                 example: Biblioteca
 *     responses:
 *       201:
 *         description: Sesión creada
 *       401:
 *         description: No autorizado
 */
router.post('/', autenticar, ctrl.crear);


/**
 * @swagger
 * /api/sesiones/{id}:
 *   put:
 *     summary: Actualizar sesión
 *     tags: [Sesiones]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               materia:
 *                 type: string
 *               fechaHora:
 *                 type: string
 *                 format: date-time
 *               descripcion:
 *                 type: string
 *               lugar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sesión actualizada
 *       404:
 *         description: No encontrada
 */
router.put('/:id', autenticar, ctrl.actualizar);


/**
 * @swagger
 * /api/sesiones/{id}:
 *   delete:
 *     summary: Eliminar sesión
 *     tags: [Sesiones]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eliminada correctamente
 *       404:
 *         description: No encontrada
 */
router.delete('/:id', autenticar, ctrl.eliminar);


/**
 * @swagger
 * /api/sesiones/{id}/unirse:
 *   post:
 *     summary: Unirse a sesión en tiempo real
 *     tags: [Sesiones]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Unido a la sesión
 *       404:
 *         description: Sesión no encontrada
 */
router.post('/:id/unirse', autenticar, ctrl.unirseSesion);

module.exports = router;