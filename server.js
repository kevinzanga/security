require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Sequelize, DataTypes } = require('sequelize');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { logEvent } = require('./logger');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'MiSecretoMuySeguro123!';

// --- Base de datos ---
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite3',
    logging: false
});

const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
});

sequelize.sync().then(() => console.log('Base de datos lista'));

// --- Middleware ---
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Servir frontend
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Rate limiter para login ---
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5,
    message: 'Demasiados intentos. Intenta más tarde.'
});

// --- Middleware de autenticación ---
function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// --- Función de saneamiento ---
function sanitizeUsername(username) {
    if (!username) return '';
    // Permitimos solo letras, números, guion y guion bajo
    return username.replace(/[^a-zA-Z0-9_-]/g, '');
}

// --- Rutas ---
// Registro
app.post('/register', async (req, res) => {
    try {
        let { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'Campos requeridos' });

        username = sanitizeUsername(username);
        if (!username) return res.status(400).json({ message: 'Usuario inválido después de sanitizar' });

        const userExists = await User.findOne({ where: { username } });
        if (userExists) return res.status(400).json({ message: 'Usuario ya existe' });

        const hashedPassword = await bcrypt.hash(password, 12);
        await User.create({ username, password: hashedPassword });

        // Log
        const ip = req.ip || req.connection.remoteAddress;
        logEvent(username, 'Registro', ip);

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// Login
app.post('/login', loginLimiter, async (req, res) => {
    try {
        let { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'Campos requeridos' });

        username = sanitizeUsername(username);
        if (!username) return res.status(400).json({ message: 'Usuario inválido' });

        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(400).json({ message: 'Usuario o contraseña incorrecta' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Usuario o contraseña incorrecta' });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });

        // Log
        const ip = req.ip || req.connection.remoteAddress;
        logEvent(username, 'Login', ip);

        res.json({ message: 'Inicio de sesión exitoso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// Pantalla de bienvenida
app.get('/welcome', authenticateToken, (req, res) => {
    res.json({ message: `Bienvenido, usuario ${req.user.userId}` });
});

// Logout
app.post('/logout', (req, res) => {
    let username = 'Usuario desconocido';
    try {
        const token = req.cookies.token;
        if (token) {
            const user = jwt.verify(token, JWT_SECRET);
            username = `Usuario ${user.userId}`;
        }
    } catch (err) {}

    const ip = req.ip || req.connection.remoteAddress;
    logEvent(username, 'Logout', ip);

    res.clearCookie('token');
    res.json({ message: 'Sesión cerrada' });
});

// --- Iniciar servidor ---
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
