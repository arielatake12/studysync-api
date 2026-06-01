'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 */

// ─────────────────────────────────────────
// POST /auth/register
// ─────────────────────────────────────────

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 example: juan@upds.edu.bo
 *               password:
 *                 type: string
 *                 example: MiPassword123!
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 email:
 *                   type: string
 *                 creadoEn:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Campos faltantes
 *       409:
 *         description: Email ya registrado
 */
router.post('/register', async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: 'nombre, email y password son requeridos'
      });
    }

    const existe = await prisma.usuario.findUnique({
      where: { email }
    });

    if (existe) {
      return res.status(409).json({
        error: 'El email ya está registrado'
      });
    }

    const hash = await bcrypt.hash(password, 12);

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hash
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        creadoEn: true
      }
    });

    return res.status(201).json(usuario);

  } catch (err) {
    next(err);
  }
});


// ─────────────────────────────────────────
// POST /auth/login
// ─────────────────────────────────────────

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@upds.edu.bo
 *               password:
 *                 type: string
 *                 example: MiPassword123!
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Campos faltantes
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'email y password son requeridos'
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    const valido = await bcrypt.compare(password, usuario.password);

    if (!valido) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;