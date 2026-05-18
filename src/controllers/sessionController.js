import sessions from '../models/sessionModel.js';

// 1. [GET] Listar registros / Filtrar por materia
export const getAllSessions = (req, res, next) => {
    try {
        const { materia } = req.query;
        if (materia) {
            const filteredSessions = sessions.filter(s => 
                s.materia.toLowerCase().includes(materia.toLowerCase())
            );
            return res.status(200).json(filteredSessions);
        }
        res.status(200).json(sessions);
    } catch (error) {
        next(error);
    }
};

// 2. [GET] Obtener un registro por ID
export const getSessionById = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const session = sessions.find(s => s.id === id);

        if (!session) {
            return res.status(404).json({ 
                error: "Not Found",
                message: `La sesión de estudio con el ID ${id} no existe.` 
            });
        }
        res.status(200).json(session);
    } catch (error) {
        next(error);
    }
};

// 3. [POST] Crear un registro nuevo
export const createSession = (req, res, next) => {
    try {
        const { materia, fecha, hora, enlace } = req.body;
        const missingFields = [];
        if (!materia) missingFields.push("materia");
        if (!fecha) missingFields.push("fecha");
        if (!hora) missingFields.push("hora");

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: "Bad Request",
                message: `Faltan campos obligatorios: ${missingFields.join(', ')}`
            });
        }

        const newSession = {
            id: sessions.length > 0 ? sessions[sessions.length - 1].id + 1 : 1,
            materia,
            fecha,
            hora,
            enlace: enlace || ""
        };

        sessions.push(newSession);
        res.status(201).json(newSession);
    } catch (error) {
        next(error);
    }
};

// 4. [PUT] Actualizar un registro completo
export const updateSession = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const index = sessions.findIndex(s => s.id === id);

        if (index === -1) {
            return res.status(404).json({ 
                error: "Not Found",
                message: `No se encontró la sesión con ID ${id} para actualizarla.` 
            });
        }

        const { materia, fecha, hora, enlace } = req.body;
        sessions[index] = {
            id,
            materia: materia || sessions[index].materia,
            fecha: fecha || sessions[index].fecha,
            hora: hora || sessions[index].hora,
            enlace: enlace || sessions[index].enlace
        };

        res.status(200).json(sessions[index]);
    } catch (error) {
        next(error);
    }
};

// 5. [DELETE] Eliminar un registro
export const deleteSession = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const index = sessions.findIndex(s => s.id === id);

        if (index === -1) {
            return res.status(404).json({ 
                error: "Not Found",
                message: `No se encontró la sesión con ID ${id} para eliminarla.` 
            });
        }

        const deletedSession = sessions.splice(index, 1);
        res.status(200).json({ message: "Sesión eliminada con éxito", data: deletedSession[0] });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// NUEVOS ENDPOINTS PARA LLEGAR A 9
// ==========================================

// 6. [GET] Estadísticas generales de la API
export const getSessionStats = (req, res, next) => {
    try {
        const totalSesiones = sessions.length;
        // Contar materias únicas registradas
        const materiasUnicas = [...new Set(sessions.map(s => s.materia))].length;

        res.status(200).json({
            estado: "Exitoso",
            metricas: {
                total_sesiones_programadas: totalSesiones,
                total_materias_distintas: materiasUnicas,
                servidor_status: "Online"
            }
        });
    } catch (error) {
        next(error);
    }
};

// 7. [GET] Listar sesiones ordenadas por fecha (De la más cercana a la más lejana)
export const getSortedSessions = (req, res, next) => {
    try {
        const sorted = [...sessions].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        res.status(200).json(sorted);
    } catch (error) {
        next(error);
    }
};

// 8. [DELETE] Resetear / Vaciar toda la base de datos temporal
export const clearAllSessions = (req, res, next) => {
    try {
        sessions.length = 0; // Vacía el arreglo original por completo
        res.status(200).json({ 
            message: "Base de datos temporal reseteada. Todas las sesiones han sido eliminadas." 
        });
    } catch (error) {
        next(error);
    }
};