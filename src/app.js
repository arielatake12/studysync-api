import express from 'express';
import dotenv from 'dotenv';
import sessionRoutes from './routes/sessionRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rutas de la API
app.use('/api', sessionRoutes);

app.get('/', (req, res) => {
    res.send('¡API de StudySync corriendo exitosamente!');
});

// -------------------------------------------------------------
// RÚBRICA: Middleware de manejo de errores global (Express)
// -------------------------------------------------------------
app.use((err, req, res, next) => {
    console.error("💥 Error interno detectado:", err.stack);
    
    res.status(500).json({
        error: "Internal Server Error",
        message: "Ocurrió un error inesperado en el servidor de la API.",
        details: err.message // Útil para desarrollo
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});