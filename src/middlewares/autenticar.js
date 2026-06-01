'use strict';

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 1. Validar existencia del header
    if (!authHeader) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    // 2. Validar formato Bearer
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Formato inválido. Usa Bearer token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 3. Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Guardar usuario en request
        req.usuario = decoded;

        next();

    } catch (err) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
};