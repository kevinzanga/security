// --- Tabs del frontend ---
function switchTab(tab) {
    const loginPanel = document.getElementById('login-panel');
    const registerPanel = document.getElementById('register-panel');
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');

    if (tab === 'login') {
        loginPanel.style.display = 'block';
        registerPanel.style.display = 'none';
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        loginPanel.style.display = 'none';
        registerPanel.style.display = 'block';
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
    }
}

// --- Filtrado en tiempo real para inputs de username ---
function setupInputSanitizer(inputId) {
    const input = document.getElementById(inputId);
    input.addEventListener('input', () => {
        // Solo letras, números, guion y guion bajo
        input.value = input.value.replace(/[^a-zA-Z0-9_-]/g, '');
    });
}

// Configuramos los inputs de login y registro
setupInputSanitizer('username');       // login
setupInputSanitizer('reg-username');   // registro

// --- Registro ---
async function register() {
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value.trim();

    if (!username || !password) return alert('Completa todos los campos');
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) return alert('Usuario solo con letras, números, guion o guion bajo');
    if (password.length < 6) return alert('Contraseña mínimo 6 caracteres');

    try {
        const res = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });
        const data = await res.json();
        alert(data.message);

        document.getElementById('reg-username').value = '';
        document.getElementById('reg-password').value = '';
        switchTab('login');
    } catch {
        alert('Error de conexión con el servidor');
    }
}

// --- Login ---
async function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) return alert('Completa todos los campos');
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) return alert('Usuario solo con letras, números, guion o guion bajo');

    try {
        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
            showWelcome();
        } else {
            alert(data.message);
        }
    } catch {
        alert('Error de conexión con el servidor');
    }
}

// --- Mostrar pantalla de bienvenida ---
async function showWelcome() {
    try {
        const res = await fetch('/welcome', { credentials: 'include' });
        if (!res.ok) return logout(); // No autenticado

        const data = await res.json();
        document.getElementById('welcome-message').textContent = data.message;

        // Ocultar contenedor de login/registro
        document.querySelector('.form-container').style.display = 'none';

        // Mostrar bienvenida con animación
        const welcomeDiv = document.getElementById('welcome');
        welcomeDiv.style.display = 'block';
        welcomeDiv.classList.add('fade-in');
    } catch {
        logout();
    }
}

// --- Logout ---
async function logout() {
    try {
        await fetch('/logout', { method: 'POST', credentials: 'include' });
    } catch {}

    const welcomeDiv = document.getElementById('welcome');
    welcomeDiv.style.display = 'none';

    // Mostrar contenedor de login/registro
    document.querySelector('.form-container').style.display = 'block';
    switchTab('login');
}

// --- Auto mostrar bienvenida si ya hay sesión ---
document.addEventListener('DOMContentLoaded', () => {
    showWelcome();
});
