# LEXIMATE-BACKEND

Backend de LEXIMATE - Plataforma de gestión de cursos, tareas y aprendizaje colaborativo.

Construido con **Node.js**, **TypeScript**, **Fastify** y **PostgreSQL**.

## Requisitos

- Node.js 18+
- Docker & Docker Compose
- pnpm (recomendado) o npm

## Inicio Rápido

### 1. Instalar Dependencias

\\\ash
pnpm install
\\\

### 2. Configurar Variables de Entorno

Crea un archivo .env en la raíz. Variables principales:

\\\nv
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=leximate
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET_KEY=tu_secreto_aqui

# Google Gemini
GOOGLE_PALM_HOST=https://generativelanguage.googleapis.com
GOOGLE_GEMINI_API_KEY=tu_api_key

# Supabase
SUPABASE_HOST=tu_host
SERVICE_ROLE_SECRET=tu_secret

# n8n
N8N_API_URL=http://localhost:5678
N8N_API_KEY=tu_api_key
N8N_ENCRYPTION_KEY=tu_encryption_key
N8N_JWT_SECRET=tu_jwt_secret

# Cloudinary (opcional)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Resend (opcional)
RESEND_API_KEY=tu_api_key
\\\

## Docker - Comandos Principales

### Aplicación Completa

\\\ash
# Levanta todo (PostgreSQL + n8n + Backend)
pnpm docker:up

# Detiene todo
pnpm docker:down

# Reinicia desde cero
pnpm docker:rebuild

# Ver logs
pnpm docker:logs
pnpm docker:logs:backend
pnpm docker:logs:postgres
pnpm docker:logs:n8n
\\\

### Base de Datos (PostgreSQL)

\\\ash
pnpm docker:db:up
pnpm docker:db:down
pnpm docker:db:reset
pnpm docker:db:shell
\\\

### n8n (Workflows)

\\\ash
pnpm docker:n8n:up
pnpm docker:n8n:down
pnpm docker:n8n:reset
\\\

### Backend

\\\ash
pnpm docker:backend:up
pnpm docker:backend:down
pnpm docker:backend:restart
pnpm docker:backend:rebuild
\\\

### Utilidades

\\\ash
pnpm docker:status
pnpm docker:shell:backend
pnpm docker:shell:postgres
pnpm docker:clean
\\\

## Scripts Disponibles

### Desarrollo

\\\ash
pnpm start:dev      # Inicia en desarrollo con hot-reload
pnpm start:build    # Compila el proyecto
pnpm start:prod     # Ejecuta la versión compilada
\\\

### n8n - Workflows y Credenciales

\\\ash
pnpm load:workflows    # Carga workflows desde /n8n/workflows/
pnpm load:credentials  # Carga credenciales desde .env
pnpm load:all          # Carga workflows + credenciales
\\\

## Estructura del Proyecto

\\\
src/
├── app.ts              # Configuración de Fastify
├── index.ts            # Punto de entrada
├── common/
│   ├── adapters/       # Adaptadores (hash, etc)
│   ├── configs/        # Configuración de variables
│   ├── enums/          # Enumeraciones
│   ├── interfaces/     # Interfaces
│   ├── libs/           # Librerías (JWT, Cloudinary, etc)
│   ├── middlewares/    # Middlewares de Fastify
│   └── types/          # Tipos de TypeScript
├── database/
│   └── db.ts           # Conexión a BD
└── modules/            # Módulos de negocio
    ├── auth/           # Autenticación
    ├── user/           # Usuarios
    ├── course/         # Cursos
    ├── task/           # Tareas
    ├── post/           # Posts
    ├── comment/        # Comentarios
    ├── tool/           # Herramientas (OCR, Chatbot)
    └── seed/           # Datos iniciales

docs/                   # Documentación de rutas
scripts/                # Scripts de utilidad
n8n/                    # Workflows y credenciales
\\\

## Rutas de la API

Documentación completa en /docs:

- [auth.md](docs/auth.md) - Autenticación (login, registro, perfil)
- [user.md](docs/user.md) - Gestión de usuarios
- [course.md](docs/course.md) - Cursos
- [task.md](docs/task.md) - Tareas
- [post.md](docs/post.md) - Posts
- [comment.md](docs/comment.md) - Comentarios
- [tool.md](docs/tool.md) - Herramientas (OCR, Chatbot, Markdown)
- [routes.md](docs/routes.md) - Referencia simplificada de todas las rutas
- [seed.md](docs/seed.md) - Datos iniciales

### Ejemplo: Crear un usuario

\\\ash
curl -X POST http://localhost:8080/api/auth/register \\
  -H \"Content-Type: application/json\" \\
  -d '{
    \"first_name\": \"Juan\",
    \"last_name\": \"Pérez\",
    \"email\": \"juan@example.com\",
    \"password\": \"Password123!\"
  }'
\\\

## Autenticación

Los endpoints protegidos requieren el header:

\\\
Authorization: Bearer <JWT_TOKEN>
\\\

## n8n - Workflows y Credenciales

### Cargar Workflows

\\\ash
pnpm load:workflows
\\\

Los workflows se cargan desde 
8n/workflows/*.json. Credenciales disponibles:

- Google PaLM API - Para Gemini
- Supabase Vector Store - Vector database
- PostgreSQL Account - Base de datos
- JWT Auth - Autenticación

### Cargar Credenciales

\\\ash
pnpm load:credentials
\\\

## Dependencias Principales

- fastify - Framework web
- typeorm - ORM para PostgreSQL
- jsonwebtoken - Tokens JWT
- bcryptjs - Hash de contraseñas
- axios - Cliente HTTP
- pdf-parse - Extracción de PDFs
- cloudinary - Almacenamiento en nube
- resend - Envío de emails
- tesseract.js - OCR

## Debugging

### Hot-reload en Docker

El backend se reinicia automáticamente al editar archivos en src/:

\\\ash
pnpm docker:up
# Edita archivos y verás los cambios en tiempo real
\\\

### Debug Remoto

Accede a Chrome DevTools en chrome://inspect:

\\\ash
pnpm docker:backend:up
# Abre chrome://inspect y conecta al puerto 9229
\\\

## Más Información

- [Documentación de Rutas](docs/routes.md)
- [TypeORM Docs](https://typeorm.io/)
- [Fastify Docs](https://www.fastify.io/)
- [n8n Docs](https://docs.n8n.io/)

## Licencia

MIT