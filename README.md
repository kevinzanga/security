TESTS.md 🧪

      Guía de pruebas manuales para verificar que las defensas de seguridad del sistema funcionan correctamente.

1. Acceso a pantalla de bienvenida sin sesión 🚫
   Objetivo: Comprobar que un usuario no autenticado no puede acceder a /welcome.
   Pasos:
      Abrir el navegador en modo incógnito.
      Intentar acceder a http://localhost:3000/welcome.
   Resultado esperado:
      El servidor responde con 401 Unauthorized.
      No se muestra información de usuario.
2. Intentos de inyección / XSS / fijación de sesión 🛡️

Objetivo: Verificar que entradas maliciosas no afecten el sistema.

Pruebas:

Inyección SQL: Enviar al registro un username como

{ "username": "admin';--", "password": "123456" }

XSS: Intentar registrar un username con código JS o HTML, por ejemplo:

<script>alert('XSS')</script>

Fijación de sesión: Intentar usar cookies o tokens inválidos para acceder a /welcome.

Resultado esperado:

Los inputs se rechazan o sanitizan.

No se ejecutan scripts maliciosos.

No se permite acceso a recursos protegidos.

El log registra intentos, pero sin datos sensibles.

3. Gestión correcta de errores ⚠️

Objetivo: Verificar que los errores no expongan stack traces ni datos sensibles.

Pasos:

Forzar un error en el backend (por ejemplo, dejar campos vacíos en registro o login).

Observar la respuesta del servidor y los logs.

Resultado esperado:

El cliente recibe mensajes genéricos (ej. "Error del servidor").

No se muestran stack traces ni información de base de datos.

Los logs internos registran detalles del error para auditoría.

4. Cierre de sesión efectivo 🔑

Objetivo: Confirmar que el logout elimina la sesión activa.

Pasos:

Iniciar sesión correctamente.

Hacer logout desde la interfaz.

Intentar acceder nuevamente a /welcome.

Resultado esperado:

Cookie de sesión eliminada.

Acceso a /welcome responde con 401 Unauthorized.

El log registra correctamente el evento de logout.
