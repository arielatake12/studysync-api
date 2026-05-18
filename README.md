# StudySync API - Gestión de Sesiones de Estudio

Esta es una API REST desarrollada con **Node.js** y **Express** bajo el patrón arquitectónico **MVC (Modelo-Vista-Controlador)** para la plataforma StudySync. Permite gestionar de manera eficiente las sesiones de estudio programadas de los estudiantes.

## 📁 Estructura del Proyecto (MVC)
- `src/models/`: Simulación de persistencia de datos en memoria (Arreglos).
- `src/controllers/`: Lógica del negocio, analíticas de datos y control de estados HTTP.
- `src/routes/`: Definición y mapeo de los endpoints de la API.
- `src/app.js`: Servidor principal y middleware global de errores.

## 🚀 Endpoints de la API (CRUD Avanzado y Métricas)

La API maneja la entidad `study-sessions` utilizando la ruta base `/api/study-sessions`. Cuenta con **9 flujos y comportamientos lógicos** para el nivel Estratégico:

| Verbo  | Ruta | Función | Status OK |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/study-sessions` | Listar todas las sesiones de estudio | `200 OK` |
| **GET** | `/api/study-sessions?materia=valor` | **(Estratégico)** Filtrar sesiones por coincidencia de materia | `200 OK` |
| **GET** | `/api/study-sessions/features/stats` | **(Estratégico)** Obtener métricas y estadísticas del sistema | `200 OK` |
| **GET** | `/api/study-sessions/features/sort` | **(Estratégico)** Listar sesiones ordenadas por fecha de forma cronológica | `200 OK` |
| **GET** | `/api/study-sessions/:id` | Obtener una sesión específica por su ID | `200 OK / 404` |
| **POST** | `/api/study-sessions` | Crear una nueva sesión de estudio con validación | `201 Created` |
| **PUT** | `/api/study-sessions/:id` | Actualizar los datos completos de una sesión por ID | `200 OK / 404` |
| **DELETE** | `/api/study-sessions/:id` | Eliminar una sesión del registro por su ID | `200 OK / 404` |
| **DELETE** | `/api/study-sessions/features/clean` | **(Estratégico)** Resetear la memoria interna (Vaciado masivo) | `200 OK` |

## 🛡️ Manejo de Errores e Integridad
- **400 Bad Request:** Si en las peticiones `POST` faltan campos obligatorios (`materia`, `fecha` o `hora`), la API responde detallando explícitamente qué campos faltan.
- **404 Not Found:** Si se busca, actualiza o elimina un ID inexistente.
- **500 Internal Server Error:** Implementación de un Middleware Global de Express que captura excepciones imprevistas para garantizar la estabilidad del servidor.

## 🌐 URL de Producción
La API se encuentra desplegada y totalmente funcional en el siguiente enlace de producción:
* **URL Pública:** [https://studysync-api-q3jf.onrender.com/api/study-sessions](https://studysync-api-q3jf.onrender.com/api/study-sessions)