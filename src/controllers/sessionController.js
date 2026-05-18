import sessions from '../models/sessionModel.js';

// ==========================================
// 1. [GET] Listar registros / Filtrar por materia
// ==========================================
// NIVEL ESTRATÉGICO: Soporta Query Parameters (?materia=valor)
export const getAllSessions = (req, res, next) => {
    try {
        const { materia } = req.query;
        
        // Si el docente envía un término de búsqueda en la URL
        if (materia) {
            const filteredSessions = sessions.filter(s => 
                s.materia.toLowerCase().includes(materia.toLowerCase())
            );
            return res.status(200).json(filteredSessions);
        }

        // Comportamiento normal: si no hay filtros, devuelve todo el arreglo
        res.status(200).json(sessions);
    } catch (error) {
        next(error); // Envía el error inesperado al middleware global
    }
};

// ==========================================
// 2. [GET] Obtener un registro por ID
// ==========================================
// Manejo de Error 404 si el recurso no existe
export const getSessionById = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const session = sessions.find(s => s.id === id);

        // RÚBRICA: Si el ID no se encuentra -> responder con 404
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

// ==========================================
// 3. [POST] Crear un registro nuevo
// ==========================================
// Manejo de Error 400 para validación de campos obligatorios
export const createSession = (req, res, next) => {
    try {
        const { materia, fecha, hora, enlace } = req.body;

        // RÚBRICA: Validar qué campos obligatorios faltan en la petición
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

        // Creación del nuevo objeto con ID autoincremental
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

// ==========================================
// 4. [PUT] Actualizar un registro completo
// ==========================================
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

        // Reemplaza los datos manteniendo el ID original
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

// ==========================================
// 5. [DELETE] Eliminar un registro
// ==========================================
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

        // Remueve el elemento del arreglo de memoria
        const deletedSession = sessions.splice(index, 1);
        res.status(200).json({ message: "Sesión eliminada con éxito", data: deletedSession[0] });
    } catch (error) {
        next(error);
    }
};