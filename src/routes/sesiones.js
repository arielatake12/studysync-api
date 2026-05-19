// src/routes/sesiones.js
// Define qué función del controlador se ejecuta para cada verbo + ruta
const express = require('express');
const router = express.Router();

// Importación limpia hacia el controlador de sesiones
const ctrl = require('../controllers/sesionesController');

// Mapeo de rutas al controlador
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtenerUna);
router.post('/', ctrl.crear);
router.put('/:id', ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

module.exports = router;