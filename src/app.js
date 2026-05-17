import express from 'express';
import dotenv from 'dotenv';
import sessionRoutes from './routes/sessionRoutes.js';

// Cargar variables de entorno (.env)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para poder recibir datos en formato JSON en el cuerpo de las peticiones
app.use(express.json());

// Registrar las rutas bajo el prefijo /api requerido
app.use('/api', sessionRoutes);

// Ruta raíz de prueba
app.get('/', (req, res) => {
    res.send('¡API de StudySync corriendo exitosamente!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});