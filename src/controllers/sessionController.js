import sessions from '../models/sessionModel.js';

// [GET] Listar todos los registros -> Status 200
export const getAllSessions = (req, res) => {
    res.status(200).json(sessions);
};

// [GET] Obtener uno por ID -> Status 200 / 404
export const getSessionById = (req, res) => {
    const id = parseInt(req.params.id);
    const session = sessions.find(s => s.id === id);

    if (!session) {
        return res.status(404).json({ message: "Sesión de estudio no encontrada" });
    }
    res.status(200).json(session);
};

// [POST] Crear un registro nuevo -> Status 201
export const createSession = (req, res) => {
    const { materia, fecha, hora, enlace } = req.body;

    // Validación básica
    if (!materia || !fecha || !hora) {
        return res.status(400).json({ message: "Faltan campos obligatorios (materia, fecha u hora)" });
    }

    // Generar ID autoincremental basado en el último elemento
    const newSession = {
        id: sessions.length > 0 ? sessions[sessions.length - 1].id + 1 : 1,
        materia,
        fecha,
        hora,
        enlace: enlace || ""
    };

    sessions.push(newSession);
    res.status(201).json(newSession);
};

// [PUT] Actualizar un registro completo -> Status 200 / 404
export const updateSession = (req, res) => {
    const id = parseInt(req.params.id);
    const index = sessions.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Sesión de estudio no encontrada para actualizar" });
    }

    const { materia, fecha, hora, enlace } = req.body;

    // Reemplazo o actualización de los campos
    sessions[index] = {
        id,
        materia: materia || sessions[index].materia,
        fecha: fecha || sessions[index].fecha,
        hora: hora || sessions[index].hora,
        enlace: enlace || sessions[index].enlace
    };

    res.status(200).json(sessions[index]);
};

// [DELETE] Eliminar un registro -> Status 200 / 404
export const deleteSession = (req, res) => {
    const id = parseInt(req.params.id);
    const index = sessions.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Sesión de estudio no encontrada para eliminar" });
    }

    // Eliminar del arreglo
    const deletedSession = sessions.splice(index, 1);
    res.status(200).json({ message: "Sesión eliminada con éxito", data: deletedSession[0] });
};