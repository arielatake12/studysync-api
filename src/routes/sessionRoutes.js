import express from 'express';
import { 
    getAllSessions, 
    getSessionById, 
    createSession, 
    updateSession, 
    deleteSession,
    getSessionStats,
    getSortedSessions,
    clearAllSessions
} from '../controllers/sessionController.js';

const router = express.Router();

// Rutas base y de filtros
router.get('/', getAllSessions);

// Rutas de características avanzadas (Nuevas)
router.get('/features/stats', getSessionStats);
router.get('/features/sort', getSortedSessions);
router.delete('/features/clean', clearAllSessions);

// Rutas con parámetros por ID (Siempre van abajo)
router.get('/:id', getSessionById);
router.post('/', createSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

export default router;