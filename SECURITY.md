## Riesgos identificados y mitigación ⚠️

1. **Inyección SQL 🐍**
   - **Riesgo:** Un atacante podría intentar insertar código SQL malicioso en los formularios para leer, modificar o eliminar datos de la base de datos.
   - **Mitigación:** Se utiliza **Sequelize**, un ORM que construye consultas parametrizadas automáticamente, eliminando la posibilidad de inyecciones SQL tradicionales. No se ejecutan consultas crudas con interpolación de strings.

2. **Cross-Site Scripting (XSS) 💻**
   - **Riesgo:** Código JavaScript malicioso inyectado por el usuario podría ejecutarse en otros navegadores y robar cookies o datos.
   - **Mitigación:** Se sanitizan los inputs tanto en el **frontend** como en el **backend**. Solo se permiten caracteres alfanuméricos, guion bajo y guion en usernames. No se muestran datos sin sanitizar en la interfaz.

3. **Fuerza bruta / ataques de autenticación 🔐**
   - **Riesgo:** Intentos repetidos de adivinar contraseñas para acceder a cuentas.
   - **Mitigación:** Se implementó **rate limiting** en la ruta de login (`express-rate-limit`) para bloquear múltiples intentos en un corto periodo. Además, las contraseñas se almacenan **hasheadas con bcrypt**.

4. **Robo o fijación de sesión 🕵️‍♂️**
   - **Riesgo:** Cookies de sesión podrían ser interceptadas o reutilizadas para hacerse pasar por otro usuario.
   - **Mitigación:** Se usan **JWT con expiración** y cookies **HttpOnly** y `SameSite: strict` para evitar accesos desde scripts maliciosos. El logout elimina las cookies y los tokens expiran automáticamente.

5. **Exposición de información sensible ⚡**
   - **Riesgo:** Mensajes de error del servidor podrían mostrar stack traces o datos de la base de datos.
   - **Mitigación:** Se maneja correctamente el error en el backend, mostrando mensajes genéricos al cliente y registrando los detalles en los logs internos para análisis.

6. **Enumeración de usuarios 👤**
   - **Riesgo:** Mensajes de error diferenciados podrían permitir identificar usuarios registrados.
   - **Mitigación:** Los errores de login devuelven mensajes genéricos (“Usuario o contraseña incorrecta”) sin indicar si el usuario existe o no.

---

## Decisiones de diseño de seguridad 🛡️

- **Validación y saneamiento doble ✅:** Todos los inputs se validan en frontend y backend para evitar bypass por clientes maliciosos.
- **Hash de contraseñas con bcrypt 🔑:** Protege credenciales ante posibles fugas de datos.
- **Logs de accesos 📋:** Se registran login, logout y registro de usuarios con fecha, IP y usuario, pero sin incluir contraseñas ni datos sensibles.
- **ORM (Sequelize) 🗄️:** Previene inyecciones SQL y simplifica la gestión segura de datos.
- **Frontend seguro 🖥️:** Solo permite caracteres válidos, evitando XSS y ataques de inyección en la interfaz.
- **Gestión de sesiones ⏱️:** JWT con expiración y cookies HttpOnly + SameSite, logout efectivo.

---

## Límites conocidos / trabajo futuro 🚧

1. **HTTPS 🌐:** Actualmente solo se corre en HTTP para desarrollo local. Se recomienda implementar HTTPS en producción para cifrado de transporte.
2. **Auditoría de seguridad completa 🔎:** No se han realizado pruebas automáticas de penetración ni fuzzing avanzado.
3. **Tokens más robustos 🛡️:** JWT usa firma simétrica (HS256); podría usarse RS256 para mayor seguridad y separación de llaves.
4. **Política de contraseñas 🔑:** Actualmente solo se valida longitud mínima; se recomienda fortalecer con complejidad (mayúsculas, números, símbolos).
5. **Protección CSRF 🛡️:** No implementada aún, aunque las cookies SameSite ayudan a mitigar. Podría agregarse un token CSRF para mayor seguridad.
6. **Control de roles y permisos 👥:** Por ahora, todos los usuarios tienen acceso a la misma funcionalidad; podría implementarse control de roles más granular.

---