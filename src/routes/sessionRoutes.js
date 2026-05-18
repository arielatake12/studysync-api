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

// 1. Rutas de funciones analíticas (¡SIEMPRE ARRIBA DEL TODO!)
// Como en tu app.js pusiste '/api', la URL real será: /api/study-sessions/features/stats
router.get('/study-sessions/features/stats', getSessionStats);
router.get('/study-sessions/features/sort', getSortedSessions);
router.delete('/study-sessions/features/clear', clearAllSessions);

// 2. Rutas Base (Listar todo / Filtro de materias y Crear)
// URL real: /api/study-sessions
router.get('/study-sessions', getAllSessions);
router.post('/study-sessions', createSession);

// 3. Rutas con parámetro dinámico :id (AL FINAL DEL ARCHIVO)
// URL real: /api/study-sessions/:id
router.get('/study-sessions/:id', getSessionById);
router.put('/study-sessions/:id', updateSession);
router.delete('/study-sessions/:id', deleteSession);

export default router;