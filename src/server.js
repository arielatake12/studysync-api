const app = require('./app');

// Obtenemos el puerto desde el archivo .env (y si no existe, usamos el 3000 por defecto)
const PORT = process.env.PORT || 3000;

// Encender el servidor
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`🌍 Entorno actual: ${process.env.NODE_ENV || 'development'}`);
    console.log(`==================================================`);
});