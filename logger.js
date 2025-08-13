const fs = require('fs');
const path = require('path');

// Carpeta donde se guardarán los logs
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Función para obtener fecha y hora local (Bolivia, UTC−4)
function getFechaLocal() {
    const ahora = new Date();
    return ahora.toLocaleString('es-BO', { hour12: false });
}

/**
 * Registrar un evento
 * @param {string} usuario - Nombre de usuario
 * @param {string} evento - Evento (Login, Logout, Registro, etc.)
 * @param {string} ip - IP del usuario
 */
function logEvent(usuario = 'Usuario desconocido', evento = 'Evento desconocido', ip = 'IP desconocida') {
    const fecha = getFechaLocal();
    const usuarioSanitizado = usuario.replace(/[^a-zA-Z0-9_\-\s]/g, '');
    const logEntry = `${fecha} - Usuario: ${usuarioSanitizado} - Evento: ${evento} - IP: ${ip}\n`;

    const logFileName = `accesos_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.log`;
    const logFile = path.join(logDir, logFileName);

    // Escribir log de forma segura
    fs.open(logFile, 'a', (err, fd) => {
        if (err) return console.error('Error abriendo archivo de log:', err);
        fs.write(fd, logEntry, (err) => {
            if (err) console.error('Error escribiendo log:', err);
            fs.close(fd, () => {});
        });
    });
}

module.exports = { logEvent };
