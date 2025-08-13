# 🛡 Proyecto Security frontend y backend

Este proyecto es un backend desarrollado con **Node.js**, **Express** y **SQLite** usando **Sequelize**, enfocado en la implementación de medidas de seguridad para prevenir ataques como **inyección SQL**, **XSS** y **fuerza bruta**.

---

## 📋 Requisitos previos

Antes de iniciar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) (incluido con Node.js)
- Git (para clonar el repositorio)

---

## 🚀 Instalación y ejecución local

1. **Clonar el repositorio**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_PROYECTO>
2. Instalar dependencias necesarias
   npm install express bcryptjs jsonwebtoken cors cookie-parser sequelize sqlite3 express-rate-limit dotenv
3. Iniciar el servidor
   node server.js
4. Servidor Disponible en: 
   http://localhost:3000
   
##  🛡 Características de seguridad implementadas
    Hash de contraseñas con bcryptjs.
    Autenticación segura con JWT y expiración.
    Rate limiting para prevenir ataques de fuerza bruta.
    Validación de entradas en servidor y cliente.
    Protección contra inyección SQL mediante Sequelize.
    Sesiones seguras y manejo seguro de cookies.
    Manejo centralizado de errores sin filtrar datos sensibles.
##  📂 Estructura del proyecto
        / (raíz)
     ├── index.js          # Punto de entrada del servidor
     ├── routes/           # Definición de rutas API
     ├── models/           # Modelos de Sequelize
     ├── middlewares/      # Middlewares de seguridad
     ├── .env              # Variables de entorno (no se sube a GitHub)
     └── README.md         # Documentación del proyecto
