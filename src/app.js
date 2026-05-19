const express = require('express');
const dotenv = require('dotenv');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const app = express();

// Middleware obligatorio para que nuestra API entienda formato JSON
app.use(express.json());

// Ruta de prueba inicial para verificar que la API responde
app.get('/', (req, res) => {
    res.status(200).json({
        mensaje: "¡Bienvenido a la API de StudySync! El servidor está respondiendo correctamente."
    });
});

// Exportamos la app para que server.js la pueda inicializar
module.exports = app;