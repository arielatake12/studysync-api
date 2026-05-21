// src/routes/sesiones.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sesionesController');

router.get('/', ctrl.listar);
router.post('/', ctrl.crear);

router.get('/:id', ctrl.obtenerUna);
router.put('/:id', ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

router.get('/materia/:materia', ctrl.filtrarPorMateria);
router.post('/:id/unirse', ctrl.unirseSesion);

module.exports = router;