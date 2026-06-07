# Incidencias TIC - Supabase + GitHub Pages

## 🔗 Enlace de la aplicación
https://sroldanleon.github.io/incidencias-tic/

---

## 🧠 Descripción del proyecto

Aplicación web para la gestión de incidencias TIC en un centro educativo.  
Permite a los usuarios registrarse, iniciar sesión, crear incidencias, ver sus propias incidencias y cerrarlas.

Tecnologías utilizadas:
- HTML, CSS y JavaScript
- Supabase (Auth + Base de datos + RLS)
- GitHub Pages (despliegue)

---

## ☁️ Procedimiento de almacenaje cloud (CE.f)

### 📊 Estructura de la base de datos

La tabla `incidencias` contiene:

- id (identificador único)
- user_id (propietario de la incidencia)
- aula (ubicación del problema)
- equipo (dispositivo afectado)
- tipo (tipo de incidencia)
- descripcion (detalle técnico)
- estado (abierta / cerrada)
- created_at (fecha de creación)

---

### 🔐 Autenticación

Se utiliza **Supabase Auth**:
- Registro de usuarios con email y contraseña
- Inicio de sesión seguro
- Sesión persistente en el navegador

---

### 🛡️ Permisos y seguridad (RLS)

- Row Level Security activado en la tabla `incidencias`
- Cada usuario solo puede:
  - Ver sus propias incidencias
  - Crear incidencias propias
  - Actualizar sus propias incidencias

---

### 🔌 Conexión frontend - Supabase

El frontend se conecta mediante:
- Supabase URL
- ANON KEY (pública)

Operaciones:
- INSERT → crear incidencias
- SELECT → listar incidencias del usuario
- UPDATE → cerrar incidencias

---

## ☁️ Importancia del cloud (CE.g)

### 🚀 Productividad
- Desarrollo rápido sin backend propio
- Despliegue automático con GitHub Pages
- Base de datos lista en minutos

### 🔐 Seguridad
- Autenticación integrada
- Control de acceso con RLS
- Cada usuario solo ve sus datos

### 💰 Coste
- Uso gratuito con Supabase free tier
- Sin necesidad de servidores físicos

### 📈 Escalabilidad
- Base de datos cloud escalable
- Acceso desde cualquier dispositivo

---

## 🛡️ RA5 - Seguridad, riesgos y medidas

### ⚠️ Riesgos
1. Exposición de la ANON KEY en repositorio público
2. Falta de RLS permitiría acceso a datos de otros usuarios
3. Introducción de datos personales en incidencias

### ✅ Medidas de protección
1. Uso obligatorio de RLS en Supabase
2. Políticas basadas en auth.uid()
3. No almacenar datos personales (RA5)
4. Uso de ANON KEY (no service key)
5. Validación básica de formularios

---

## 📸 Evidencias

### 🗄️ Tabla en Supabase
![Tabla Supabase](images/incidenciastic1.png)

---

### 🔐 RLS activado
![RLS](images/incidenciastic2.png)

---

### 📜 Policies
![Policies](images/incidenciastic3.png)

---

### 💻 Aplicación funcionando
![App](images/incidenciastic4.png)

---

## 🚀 Autor
Proyecto realizado como práctica de Cloud Computing y Supabase.
