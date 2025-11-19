# 🎓 LEXIMATE Backend

> Plataforma de gestión de cursos, tareas y aprendizaje colaborativo con actualizaciones en tiempo real

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-4.0+-black.svg)](https://www.fastify.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📑 Tabla de Contenidos

- [Características](#-características)
- [Requisitos](#-requisitos)
- [Inicio Rápido](#-inicio-rápido)
- [Configuración](#-configuración)
- [Docker](#-docker)
- [Scripts Disponibles](#-scripts-disponibles)
- [Arquitectura](#-arquitectura)
- [API Documentation](#-api-documentation)
- [WebSocket - Tiempo Real](#-websocket---tiempo-real)
- [Dependencias](#-dependencias)
- [Desarrollo](#-desarrollo)

---

## ✨ Características

### Core Features
- 🔐 **Autenticación JWT** - Login, registro y gestión de sesiones
- 👥 **Gestión de Usuarios** - Roles (admin, teacher, student)
- 📚 **Cursos** - Crear, unirse y gestionar cursos
- 📝 **Tareas** - Asignaciones con entregas y calificaciones
- 💬 **Posts & Comentarios** - Foro de discusión por curso
- 💼 **Chat en Tiempo Real** - Mensajería entre usuarios

### Features Avanzados
- ⚡ **WebSocket en Tiempo Real** - 18 eventos diferentes para actualizaciones instantáneas
- 🤖 **IA Integrada** - Chatbot con Google Gemini
- 📄 **OCR** - Extracción de texto desde imágenes
- 📧 **Notificaciones** - Sistema de notificaciones persistentes
- 🔄 **n8n Workflows** - Automatizaciones y flujos de trabajo
- ☁️ **Cloudinary** - Almacenamiento de archivos en la nube

---

## 🔧 Requisitos

| Requisito | Versión |
|-----------|---------|
| Node.js | 18+ |
| pnpm | 8+ (recomendado) |
| Docker | 20+ |
| Docker Compose | 2+ |
| PostgreSQL | 15+ (si no usas Docker) |

---

## 🚀 Inicio Rápido

### 1️⃣ Clonar e Instalar

```bash
git clone <repository-url>
cd LEXIMATE-BACKEND
pnpm install
```

### 2️⃣ Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# === Base de Datos ===
DB_HOST=localhost
DB_PORT=5432
DB_NAME=leximate
DB_USER=postgres
DB_PASSWORD=postgres

# === JWT ===
JWT_SECRET_KEY=tu_secreto_super_seguro_aqui

# === Google Gemini (IA) ===
GOOGLE_PALM_HOST=https://generativelanguage.googleapis.com
GOOGLE_GEMINI_API_KEY=tu_api_key_de_gemini

# === Supabase ===
SUPABASE_HOST=https://tu-proyecto.supabase.co
SERVICE_ROLE_SECRET=tu_service_role_secret

# === n8n (Workflows) ===
N8N_API_URL=http://localhost:5678
N8N_API_KEY=tu_n8n_api_key
N8N_ENCRYPTION_KEY=tu_encryption_key
N8N_JWT_SECRET=tu_jwt_secret

# === Cloudinary (Opcional) ===
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_cloudinary_api_key
CLOUDINARY_API_SECRET=tu_cloudinary_secret

# === Resend (Emails - Opcional) ===
RESEND_API_KEY=tu_resend_api_key
```

### 3️⃣ Levantar con Docker

```bash
# Levanta todo: PostgreSQL + n8n + Backend
pnpm docker:up

# El servidor estará disponible en:
# - Backend: http://localhost:8080
# - n8n: http://localhost:5678
# - PostgreSQL: localhost:5432
```

### 4️⃣ Cargar Datos Iniciales (Opcional)

```bash
# Seed de usuarios, cursos y tareas de ejemplo
curl -X POST http://localhost:8080/api/seed
```

---

## ⚙️ Configuración

### Variables de Entorno Requeridas

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `DB_HOST` | Host de PostgreSQL | ✅ |
| `DB_PORT` | Puerto de PostgreSQL | ✅ |
| `DB_NAME` | Nombre de la base de datos | ✅ |
| `DB_USER` | Usuario de PostgreSQL | ✅ |
| `DB_PASSWORD` | Contraseña de PostgreSQL | ✅ |
| `JWT_SECRET_KEY` | Secreto para firmar JWT | ✅ |
| `GOOGLE_GEMINI_API_KEY` | API key de Google Gemini | ⚠️ (para chatbot) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ⚠️ (para archivos) |
| `RESEND_API_KEY` | API key de Resend | ❌ (opcional) |

---

## 🐳 Docker

### Comandos Principales

```bash
# Aplicación completa
pnpm docker:up              # Levanta todo
pnpm docker:down            # Detiene todo
pnpm docker:rebuild         # Reconstruye desde cero
pnpm docker:logs            # Ver logs de todos los servicios
pnpm docker:status          # Estado de contenedores
pnpm docker:clean           # Limpia volúmenes y contenedores
```

### Servicios Individuales

#### Backend
```bash
pnpm docker:backend:up          # Inicia backend
pnpm docker:backend:down        # Detiene backend
pnpm docker:backend:restart     # Reinicia backend
pnpm docker:backend:rebuild     # Reconstruye backend
pnpm docker:shell:backend       # Shell en el contenedor
```

#### Base de Datos
```bash
pnpm docker:db:up           # Inicia PostgreSQL
pnpm docker:db:down         # Detiene PostgreSQL
pnpm docker:db:reset        # Resetea la base de datos
pnpm docker:shell:postgres  # Shell en PostgreSQL
```

#### n8n (Workflows)
```bash
pnpm docker:n8n:up          # Inicia n8n
pnpm docker:n8n:down        # Detiene n8n
pnpm docker:n8n:reset       # Resetea n8n
```

### Logs por Servicio

```bash
pnpm docker:logs:backend    # Solo backend
pnpm docker:logs:postgres   # Solo PostgreSQL
pnpm docker:logs:n8n        # Solo n8n
```

---

## 📜 Scripts Disponibles

### Desarrollo Local

```bash
pnpm start:dev      # Inicia en modo desarrollo con hot-reload
pnpm start:build    # Compila el proyecto TypeScript
pnpm start:prod     # Ejecuta la versión compilada
```

### n8n - Workflows

```bash
pnpm load:workflows      # Carga workflows desde /n8n/workflows/
pnpm load:credentials    # Carga credenciales desde variables de entorno
pnpm load:all           # Carga workflows + credenciales
```

### Utilidades

```bash
pnpm test           # Ejecuta tests (si existen)
pnpm lint           # Linter (si está configurado)
```

---

## 🏗️ Arquitectura

### Estructura del Proyecto

```
LEXIMATE-BACKEND/
├── src/
│   ├── app.ts                      # Configuración de Fastify
│   ├── index.ts                    # Punto de entrada
│   ├── common/
│   │   ├── adapters/               # Hash, encriptación
│   │   ├── configs/                # Configuración (env, websocket)
│   │   ├── enums/                  # Enumeraciones (roles, status)
│   │   ├── events/                 # EventEmitters para WebSocket
│   │   ├── interfaces/             # Interfaces TypeScript
│   │   ├── libs/                   # JWT, Cloudinary, Gemini
│   │   ├── middlewares/            # Auth, validación
│   │   └── types/                  # Tipos personalizados
│   ├── database/
│   │   └── db.ts                   # Conexión a PostgreSQL
│   └── modules/
│       ├── auth/                   # Autenticación (login, register)
│       ├── user/                   # Gestión de usuarios
│       ├── course/                 # Cursos
│       ├── task/                   # Tareas y entregas
│       ├── post/                   # Posts del foro
│       ├── comment/                # Comentarios
│       ├── chat/                   # Chat en tiempo real
│       ├── notification/           # Notificaciones
│       ├── tool/                   # IA, OCR, utilidades
│       └── seed/                   # Datos de prueba
├── docs/                           # Documentación de API
├── n8n/                           # Workflows de n8n
├── scripts/                        # Scripts de utilidad
├── docker-compose.yml              # Configuración Docker
└── README.md                       # Este archivo
```

### Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Runtime** | Node.js 18+ |
| **Lenguaje** | TypeScript 5+ |
| **Framework** | Fastify 4+ |
| **ORM** | TypeORM |
| **Base de Datos** | PostgreSQL 15+ |
| **WebSocket** | @fastify/websocket |
| **Autenticación** | JWT (jsonwebtoken) |
| **Validación** | Fastify schemas |
| **IA** | Google Gemini |
| **Almacenamiento** | Cloudinary |
| **Automatización** | n8n |

---

## 📚 API Documentation

### Endpoints Principales

| Módulo | Endpoint Base | Documentación |
|--------|---------------|---------------|
| **Auth** | `/api/auth` | [docs/auth.md](docs/auth.md) |
| **Users** | `/api/user` | [docs/user.md](docs/user.md) |
| **Courses** | `/api/course` | [docs/course.md](docs/course.md) |
| **Tasks** | `/api/course/:id/task` | [docs/task.md](docs/task.md) |
| **Posts** | `/api/course/:id/post` | [docs/post.md](docs/post.md) |
| **Comments** | `/api/course/:id/post/:id/comment` | [docs/comment.md](docs/comment.md) |
| **Chat** | `/api/chat` | [docs/chat.md](docs/chat.md) |
| **Notifications** | `/api/notification` | (nuevo) |
| **Tools** | `/api/tool` | [docs/tool.md](docs/tool.md) |
| **Seed** | `/api/seed` | [docs/seed.md](docs/seed.md) |

### Autenticación

Endpoints protegidos requieren el header:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Ejemplo: Registro de Usuario

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "password": "Password123!"
  }'
```

### Ejemplo: Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123!"
  }'
```

---

## ⚡ WebSocket - Tiempo Real

### Conexión

```javascript
const ws = new WebSocket('ws://localhost:8080/api/ws');

ws.onopen = () => {
  console.log('✅ Conectado al WebSocket');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Evento recibido:', message.type, message.data);
};
```

### Eventos Disponibles (18 tipos)

#### Posts
- `post_created` - Nuevo post en el curso
- `post_updated` - Post actualizado
- `post_deleted` - Post eliminado

#### Comentarios
- `comment_created` - Nuevo comentario
- `comment_updated` - Comentario actualizado
- `comment_deleted` - Comentario eliminado

#### Cursos
- `course_created` - Nuevo curso creado
- `course_updated` - Curso actualizado
- `course_deleted` - Curso eliminado

#### Tareas
- `task_created` - Nueva tarea asignada
- `task_updated` - Tarea actualizada
- `task_deleted` - Tarea eliminada
- `task_assigned` - Tarea asignada (preparado)
- `task_submitted` - Tarea entregada

#### Entregas (Submissions)
- `submission_qualified` - Entrega calificada
- `submission_updated` - Entrega actualizada
- `submission_deleted` - Entrega eliminada

#### Chat & Notificaciones
- `chat_message` - Nuevo mensaje de chat
- `notification` - Nueva notificación

### Ejemplo de Payload

```json
{
  "type": "post_created",
  "data": {
    "id": "uuid-del-post",
    "title": "Título del post",
    "content": "Contenido...",
    "courseId": "uuid-del-curso",
    "courseName": "Matemáticas",
    "authorId": "uuid-del-autor",
    "authorName": "Juan Pérez",
    "createdAt": "2025-11-19T18:30:00.000Z"
  }
}
```

### Integración en React

```jsx
import { useEffect, useState } from 'react';

function useRealtimeUpdates(courseId) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/api/ws');

    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      
      if (data.courseId !== courseId) return;

      switch (type) {
        case 'post_created':
          setPosts(prev => [data, ...prev]);
          break;
        case 'post_updated':
          setPosts(prev => prev.map(p => p.id === data.id ? data : p));
          break;
        case 'post_deleted':
          setPosts(prev => prev.filter(p => p.id !== data.postId));
          break;
      }
    };

    return () => ws.close();
  }, [courseId]);

  return { posts };
}
```

---

## 📦 Dependencias

### Producción

| Dependencia | Propósito |
|------------|-----------|
| `fastify` | Framework web |
| `@fastify/websocket` | WebSocket support |
| `typeorm` | ORM para PostgreSQL |
| `pg` | Driver de PostgreSQL |
| `jsonwebtoken` | Autenticación JWT |
| `bcryptjs` | Hash de contraseñas |
| `axios` | Cliente HTTP |
| `cloudinary` | Almacenamiento de archivos |
| `pdf-parse` | Extracción de PDFs |
| `tesseract.js` | OCR |
| `resend` | Envío de emails |

### Desarrollo

| Dependencia | Propósito |
|------------|-----------|
| `typescript` | Lenguaje tipado |
| `tsx` | Ejecutor TypeScript |
| `nodemon` | Hot reload |
| `@types/*` | Tipos de TypeScript |

---

## 🛠️ Desarrollo

### Hot Reload en Docker

El backend se reinicia automáticamente al editar archivos:

```bash
pnpm docker:up
# Edita archivos en src/ y verás los cambios automáticamente
```

### Debug Remoto

Para usar Chrome DevTools:

1. Levanta el backend en modo debug:
   ```bash
   pnpm docker:backend:up
   ```

2. Abre Chrome: `chrome://inspect`

3. Click en "Configure" y agrega: `localhost:9229`

4. Click en "inspect" en el proceso de Node.js

### Estructura de Módulos

Cada módulo sigue la estructura:

```
module/
├── controllers/        # Lógica de endpoints
├── services/          # Lógica de negocio
├── entities/          # Entidades de TypeORM
├── dtos/             # Data Transfer Objects
├── schemas/          # Validación de Fastify
└── routes/           # Definición de rutas
```

### Añadir un Nuevo Módulo

1. Crea la carpeta en `src/modules/nuevo-modulo/`
2. Crea entidad, servicio, controller y rutas
3. Registra las rutas en `src/app.ts`
4. Si necesitas eventos en tiempo real:
   - Crea `src/common/events/nuevo-modulo.events.ts`
   - Importa y emite eventos en el servicio
   - Agrega listener en `websocket.plugin.ts`

---

## 🔍 Testing con wscat

Instala wscat para probar WebSocket:

```bash
npm install -g wscat

# Conecta al WebSocket (necesitas un JWT válido)
wscat -c ws://localhost:8080/api/ws -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Ahora verás los eventos en tiempo real
```

---

## 📖 Recursos

- [Documentación de Rutas](docs/routes.md)
- [TypeORM Documentation](https://typeorm.io/)
- [Fastify Documentation](https://www.fastify.io/)
- [n8n Documentation](https://docs.n8n.io/)
- [Google Gemini API](https://ai.google.dev/)

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Autores

- **Equipo LEXIMATE** - [GitHub](https://github.com/tu-organizacion)

---

<p align="center">
  Hecho con ❤️ para mejorar la educación
</p>