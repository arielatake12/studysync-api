import sessions from '../models/sessionModel.js';

// [GET] Listar todos los registros
export const getAllSessions = (req, res, next) => {
    try {
        res.status(200).json(sessions);
    } catch (error) {
        next(error); // Envía el error inesperado al middleware global
    }
};

// [GET] Obtener uno por ID -> Manejo de Error 404
export const getSessionById = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const session = sessions.find(s => s.id === id);

        // RÚBRICA: Si el ID no existe -> responder con 404
        if (!session) {
            return res.status(404).json({ 
                error: "Not Found",
                message: `La sesión de estudio con el ID ${id} no existe en el sistema.` 
            });
        }
        res.status(200).json(session);
    } catch (error) {
        next(error);
    }
};

// [POST] Crear un registro nuevo -> Manejo de Error 400
export const createSession = (req, res, next) => {
    try {
        const { materia, fecha, hora, enlace } = req.body;

        // RÚBRICA: Si faltan campos obligatorios -> responder con 400 y qué campo falta
        const missingFields = [];
        if (!materia) missingFields.push("materia");
        if (!fecha) missingFields.push("fecha");
        if (!hora) missingFields.push("hora");

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: "Bad Request",
                message: `Faltan campos obligatorios para crear la sesión: ${missingFields.join(', ')}`
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

// [PUT] Actualizar un registro completo
export const updateSession = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const index = sessions.findIndex(s => s.id === id);

        if (index === -1) {
            return res.status(404).json({ 
                error: "Not Found",
                message: `No se encontró la sesión con ID ${id} para poder actualizarla.` 
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

// [DELETE] Eliminar un registro
export const deleteSession = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const index = sessions.findIndex(s => s.id === id);

        if (index === -1) {
            return res.status(404).json({ 
                error: "Not Found",
                message: `No se encontró la sesión con ID ${id} para poder eliminarla.` 
            });
        }

        const deletedSession = sessions.splice(index, 1);
        res.status(200).json({ message: "Sesión eliminada con éxito", data: deletedSession[0] });
    } catch (error) {
        next(error);
    }
};