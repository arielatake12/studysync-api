// src/routes/sesiones.js
// Define qué función del controlador se ejecuta para cada verbo + ruta
const express = require('express');
const router = express.Router();

// Importación limpia hacia el controlador de sesiones
const ctrl = require('../controllers/sesionesController');

// Mapeo de rutas al controlador (LO QUE YA TENÍAS BIEN)
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtenerUna);
router.post('/', ctrl.crear);
router.put('/:id', ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);

// ==========================================
// NUEVOS ENPOINTS AGREGADOS PARA LA DEFENSA
// ==========================================

// 6. Filtrar sesiones por materia (GET avanzado)
router.get('/materia/:materia', ctrl.filtrarPorMateria);

// 7. Unirse a una sesión de estudio (POST avanzado)
router.post('/:id/unirse', ctrl.unirseSesion);

module.exports = router;