import { Router } from 'express';
import { 
    getAllSessions, 
    getSessionById, 
    createSession, 
    updateSession, 
    deleteSession 
} from '../controllers/sessionController.js';

const router = Router();

// Mapeo de rutas según la tabla de la tarea
router.get('/study-sessions', getAllSessions);          // Listar todos
router.get('/study-sessions/:id', getSessionById);      // Obtener uno por ID
router.post('/study-sessions', createSession);          // Crear nuevo
router.put('/study-sessions/:id', updateSession);       // Actualizar completo
router.delete('/study-sessions/:id', deleteSession);    // Eliminar

export default router;