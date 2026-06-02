'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');

// 🔥 Redis (blacklist + refresh tokens)
const { redisAuth } = require('../redis/client');


// ─────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password]
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
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
// LOGIN
// ─────────────────────────────────────────

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
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

    const accessToken = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    await redisAuth.saveRefreshToken(
      usuario.id,
      refreshToken,
      7 * 24 * 60 * 60
    );

    return res.json({
      accessToken,
      refreshToken,
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


// ─────────────────────────────────────────
// REFRESH TOKEN
// ─────────────────────────────────────────

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Renovar access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nuevo access token
 *       401:
 *         description: Refresh inválido
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Refresh token requerido'
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const stored = await redisAuth.getRefreshToken(decoded.id);

    if (stored !== refreshToken) {
      return res.status(401).json({
        error: 'Refresh inválido'
      });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.json({ accessToken: newAccessToken });

  } catch (err) {
    return res.status(401).json({
      error: 'Refresh expirado o inválido'
    });
  }
});


// ─────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión (blacklist token)
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout exitoso
 */
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.sendStatus(204);

    const token = authHeader.split(' ')[1];

    const decoded = jwt.decode(token);

    const ttl = decoded.exp - Math.floor(Date.now() / 1000);

    await redisAuth.blacklistToken(token, ttl);

    await redisAuth.deleteRefreshToken(decoded.id);

    return res.json({
      message: 'Logout exitoso'
    });

  } catch (err) {
    return res.status(500).json({
      error: 'Error en logout'
    });
  }
});

module.exports = router;