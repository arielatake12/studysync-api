import express from 'express';
import { 
    getAllSessions, 
    createSession, 
    getSessionStats, 
    getSortedSessions, 
    clearAllSessions, 
    getSessionById, 
    updateSession, 
    deleteSession 
} from '../controllers/sessionController.js';

const router = express.Router();

// 1. Rutas Base (Listar todo / Filtro y Crear)
router.get('/', getAllSessions);
router.post('/', createSession);

// 2. Rutas de Funciones Avanzadas (¡DEBEN IR ANTES DE :id!)
router.get('/features/stats', getSessionStats);  // <-- Cambiado a getSessionStats
router.get('/features/sort', getSortedSessions);
router.delete('/features/clear', clearAllSessions);

// 3. Rutas con Parámetro Dinámico :id (Al final del archivo)
router.get('/:id', getSessionById);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

export default router;