'use strict';

const jwt = require('jsonwebtoken');
const { redisAuth } = require('../redis/client');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Formato inválido. Usa Bearer token' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token mal formado' });
    }

    try {

        let blacklisted = false;

        try {
            blacklisted = await redisAuth.isBlacklisted(token);
        } catch (e) {
            console.log("⚠ Redis error ignorado");
        }

        if (blacklisted) {
            return res.status(401).json({ error: 'Token inválido (logout)' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = decoded;

        next();

    } catch (err) {

        console.log("JWT ERROR:", err.message);

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }

        return res.status(403).json({ error: 'Token inválido' });
    }
};