# Dockerización de Leximate - Frontend + Backend

## 📋 Descripción

Este proyecto ahora está completamente dockerizado con:
- **Frontend**: React + Vite (archivos estáticos servidos por Nginx)
- **Backend**: NestJS (API en puerto 8080)
- **Base de datos**: PostgreSQL
- **Automatización**: n8n
- **Reverse Proxy**: Nginx

## 🚀 Inicio Rápido

### Iniciar todo el stack

```bash
# Navegar al directorio del backend
cd LEXIMATE-BACKEND

# Iniciar todos los servicios
docker-compose up --build
```

La aplicación estará disponible en:
- **Frontend + API**: http://localhost (puerto 80)
- **n8n**: http://localhost:5678

### Detener los servicios

```bash
docker-compose down
```

### Ver logs

```bash
# Todos los servicios
docker-compose logs -f

# Solo frontend
docker-compose logs -f frontend

# Solo backend
docker-compose logs -f backend

# Solo nginx
docker-compose logs -f nginx
```

## 📁 Estructura del Proyecto

```
LEXIMATE/
├── LEXIMATE-BACKEND/
│   ├── docker-compose.yaml      # Configuración de todos los servicios
│   ├── Dockerfile                # Docker del backend
│   ├── nginx/
│   │   └── nginx.conf            # Configuración de Nginx (proxy + frontend)
│   └── ...
├── LEXIMATE-FRONTEND/
│   ├── Dockerfile                # Build multi-etapa del frontend
│   ├── .env.production           # Variables de entorno para producción
│   └── src/
│       └── api/
│           └── axios.js          # Configuración de API (usa env vars)
└── README-DOCKER.md              # Este archivo
```

## 🔧 Arquitectura

### Flujo de Datos

```
Usuario → Nginx (puerto 80)
           ├── / → Frontend (archivos estáticos en /usr/share/nginx/html)
           └── /api/* → Backend (proxy a backend:8080)
                         └── PostgreSQL (puerto 5432)
```

### Volúmenes Docker

- `postgres_data`: Persistencia de la base de datos PostgreSQL
- `n8n_data`: Datos de n8n
- `frontend_build`: Archivos build del frontend (compartido entre frontend y nginx)

### Red Docker

Todos los servicios están en la red `leximate-network` (bridge) para comunicarse entre sí.

## 🛠️ Configuración

### Variables de Entorno

#### Backend (.env en LEXIMATE-BACKEND/)
El backend necesita un archivo `.env` con las siguientes variables:

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=leximate
DB_USER=tu_usuario
DB_PASSWORD=tu_password

# Otras configuraciones del backend...
```

#### Frontend (.env.production en LEXIMATE-FRONTEND/)
Ya está configurado con:

```env
VITE_API_URL=/api
```

Esto hace que todas las peticiones del frontend vayan a `/api/*`, y Nginx las proxea al backend.

## 📝 Desarrollo

### Desarrollo Local (Sin Docker)

Si prefieres desarrollar sin Docker:

**Frontend:**
```bash
cd LEXIMATE-FRONTEND
npm install
npm run dev
```

**Backend:**
```bash
cd LEXIMATE-BACKEND
npm install
npm run start:dev
```

### Hot Reload

**IMPORTANTE**: La configuración actual está optimizada para producción. El frontend se **construye durante el build del contenedor** y Nginx sirve los archivos estáticos.

Si haces cambios en el frontend, necesitas reconstruir:

```bash
docker-compose up --build frontend
```

### Alternativa con Hot Reload

Si prefieres trabajar con hot-reload durante desarrollo, puedes:

1. Usar el frontend localmente (fuera de Docker) con `npm run dev`
2. Mantener solo el backend en Docker
3. El frontend local se conectará al backend en Docker vía `http://localhost:8080/api`

## 🧪 Verificación

### 1. Verificar que todos los contenedores están corriendo

```bash
docker-compose ps
```

Deberías ver:
- ✅ leximate_db (postgres)
- ✅ leximate-backend
- ✅ leximate-frontend
- ✅ leximate-nginx
- ✅ leximate-n8n

### 2. Verificar logs sin errores

```bash
docker-compose logs
```

### 3. Acceder al frontend

Abre http://localhost en tu navegador. Deberías ver la aplicación React cargada.

### 4. Verificar conectividad con el API

- Prueba hacer login o cualquier acción que llame al backend
- Abre las DevTools (F12) → Network tab
- Verifica que las peticiones a `/api/*` se completan exitosamente

### 5. Verificar que el build del frontend se completó

```bash
docker-compose logs frontend
```

Deberías ver mensajes indicando que el build se completó exitosamente.

## 🔍 Troubleshooting

### El frontend no carga (404)

**Problema**: Nginx no encuentra los archivos del frontend

**Solución**:
```bash
# Reconstruir el contenedor del frontend
docker-compose up --build frontend

# Verificar que el volumen se montó correctamente
docker volume inspect leximate-backend_frontend_build
```

### Errores de CORS

**Problema**: El frontend no puede comunicarse con el backend

**Causa**: Esto NO debería ocurrir porque Nginx hace proxy en el mismo dominio

**Verificación**:
1. Verifica que las peticiones van a `/api/*` y no a `http://localhost:8080/api/*`
2. Revisa `src/api/axios.js` - debe usar `VITE_API_URL=/api`

### El backend no se conecta a la base de datos

**Problema**: `Error: Connection refused` al conectar a PostgreSQL

**Solución**:
1. Verifica que el archivo `.env` del backend tenga `DB_HOST=postgres` (no `localhost`)
2. Espera a que PostgreSQL esté listo:
```bash
docker-compose logs postgres
```

### Cambios en el frontend no se reflejan

**Causa**: El frontend está pre-construido en el contenedor

**Solución**:
```bash
# Reconstruir el frontend
docker-compose build frontend
docker-compose up frontend

# O reconstruir todo
docker-compose up --build
```

## 📊 Puertos Utilizados

| Servicio   | Puerto Externo | Puerto Interno | Descripción                    |
|------------|----------------|----------------|--------------------------------|
| Nginx      | 80             | 80             | Frontend + API Proxy           |
| Backend    | -              | 8080           | API (solo accesible vía Nginx) |
| PostgreSQL | 5432*          | 5432           | Base de datos                  |
| n8n        | 5678           | 5678           | Automatización workflow        |

*El puerto de PostgreSQL se expone según la variable `${DB_PORT}` en el .env

## 🎯 Próximos Pasos

- [ ] Configurar HTTPS con certificados SSL
- [ ] Agregar docker-compose para ambiente de desarrollo con hot-reload
- [ ] Configurar CI/CD para builds automáticos
- [ ] Agregar healthchecks para todos los servicios
- [ ] Configurar volúmenes para uploads del backend

## 📚 Recursos

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
