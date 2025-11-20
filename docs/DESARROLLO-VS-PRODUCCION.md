# 🚀 Guía Rápida: Desarrollo vs Producción

## 📋 Dos Configuraciones Disponibles

### 1️⃣ Desarrollo (Hot-Reload) - `docker-compose.dev.yaml`

**Usa esto cuando:** Estés desarrollando y quieras ver cambios instantáneos

```bash
cd LEXIMATE-BACKEND
docker-compose -f docker-compose.dev.yaml up --build
```

**Acceso:**
- Frontend (dev server): http://localhost:5173
- Backend API: http://localhost:5173/api/* (proxy automático)
- n8n: http://localhost:5678

**✅ Ventajas:**
- ⚡ Hot-reload instantáneo
- 🔄 Cambios en código se reflejan automáticamente
- 🛠️ Console logs y errores en tiempo real
- 📝 Ideal para desarrollo activo

**📁 Archivos usados:**
- `Dockerfile.dev` (Vite dev server)
- `docker-compose.dev.yaml`
- `.env.development`

---

### 2️⃣ Producción (Build Optimizado) - `docker-compose.yaml`

**Usa esto cuando:** Quieras probar el build de producción o deployar

```bash
cd LEXIMATE-BACKEND
docker-compose up --build
```

**Acceso:**
- Todo en uno: http://localhost (puerto 80)
- n8n: http://localhost:5678

**✅ Ventajas:**
- 🏗️ Build optimizado y minificado
- 🚀 Más cercano a producción
- 📦 Un solo puerto de acceso
- 🔒 Nginx como reverse proxy

**📁 Archivos usados:**
- `Dockerfile` (multi-stage build)
- `docker-compose.yaml`
- `.env.production`
- `nginx.conf`

---

## 🔄 Cambiar Entre Configuraciones

### Iniciar en Desarrollo
```bash
cd LEXIMATE-BACKEND

# Detener cualquier configuración anterior
docker-compose down
docker-compose -f docker-compose.dev.yaml down

# Iniciar en desarrollo
docker-compose -f docker-compose.dev.yaml up --build
```

### Iniciar en Producción
```bash
cd LEXIMATE-BACKEND

# Detener desarrollo
docker-compose -f docker-compose.dev.yaml down

# Iniciar producción
docker-compose up --build
```

---

## 📊 Comparación Rápida

| Característica | Desarrollo | Producción |
|----------------|------------|------------|
| **Comando** | `docker-compose -f docker-compose.dev.yaml up` | `docker-compose up` |
| **Hot-reload** | ✅ Sí | ❌ No |
| **Puerto frontend** | 5173 | 80 (con nginx) |
| **Build** | No (dev server) | Sí (optimizado) |
| **Velocidad cambios** | ⚡ Instantáneo | 🐌 Requiere rebuild |
| **Tamaño** | Grande | Pequeño |
| **Uso CPU/RAM** | Mayor | Menor |

---

## 💡 Tips de Desarrollo

### Ver logs en tiempo real
```bash
# Todos los servicios
docker-compose -f docker-compose.dev.yaml logs -f

# Solo frontend
docker-compose -f docker-compose.dev.yaml logs -f frontend

# Solo backend
docker-compose -f docker-compose.dev.yaml logs -f backend
```

### Reinstalar dependencias (si agregaste paquetes)
```bash
# Rebuild solo el frontend
docker-compose -f docker-compose.dev.yaml up --build frontend

# O rebuild todo
docker-compose -f docker-compose.dev.yaml up --build
```

### Trabajar con archivos locales

Los cambios que hagas en tu editor se reflejarán automáticamente:
- ✅ `LEXIMATE-FRONTEND/src/**` → Hot-reload instantáneo
- ✅ `LEXIMATE-BACKEND/src/**` → Restart automático (nodemon)

---

## 🔧 Configuración de Desarrollo

### Frontend (Vite Dev Server)
- **Puerto:** 5173
- **Proxy:** `/api/*` → `http://backend:8080`
- **Hot-reload:** Activado con polling para Docker
- **Source maps:** Habilitados para debugging

### Backend (NestJS)
- **Puerto:** 8080 (solo interno)
- **Modo:** `start:dev` con watch mode
- **Hot-reload:** Activado via nodemon

---

## 🐛 Troubleshooting

### Hot-reload no funciona

**Problema:** Los cambios no se reflejan automáticamente

**Solución:**
```bash
# 1. Verifica que estés usando docker-compose.dev.yaml
docker-compose -f docker-compose.dev.yaml ps

# 2. Verifica los logs del frontend
docker-compose -f docker-compose.dev.yaml logs frontend | grep -i "hmr\|reload"

# 3. Rebuild si es necesario
docker-compose -f docker-compose.dev.yaml up --build frontend
```

### Puerto 5173 en uso

**Problema:** `Error: Port 5173 is already in use`

**Solución:**
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force

# O cambia el puerto en docker-compose.dev.yaml
ports:
  - '3000:5173'  # Usa puerto 3000 externamente
```

### Cambios en package.json no se reflejan

**Problema:** Instalaste un paquete nuevo pero no aparece

**Solución:**
```bash
# Rebuild para reinstalar node_modules
docker-compose -f docker-compose.dev.yaml down
docker-compose -f docker-compose.dev.yaml up --build
```

---

## 🎯 Recomendación

**Para desarrollo diario:** Usa `docker-compose.dev.yaml`
**Para testing pre-deploy:** Usa `docker-compose.yaml`
**Para commits/CI/CD:** Asegúrate que funcione con ambos

---

## 📚 Archivos Clave

### Desarrollo
- [`Dockerfile.dev`](file:///c:/Users/sr-robot/OneDrive/Documentos/LEXIMATE/LEXIMATE-FRONTEND/Dockerfile.dev) - Frontend dev container
- [`docker-compose.dev.yaml`](file:///c:/Users/sr-robot/OneDrive/Documentos/LEXIMATE/LEXIMATE-BACKEND/docker-compose.dev.yaml) - Stack de desarrollo
- [`.env.development`](file:///c:/Users/sr-robot/OneDrive/Documentos/LEXIMATE/LEXIMATE-FRONTEND/.env.development) - Env vars desarrollo
- [`vite.config.js`](file:///c:/Users/sr-robot/OneDrive/Documentos/LEXIMATE/LEXIMATE-FRONTEND/vite.config.js) - Config proxy y dev server

### Producción
- [`Dockerfile`](file:///c:/Users/sr-robot/OneDrive/Documentos/LEXIMATE/LEXIMATE-FRONTEND/Dockerfile) - Frontend build optimizado
- [`docker-compose.yaml`](file:///c:/Users/sr-robot/OneDrive/Documentos/LEXIMATE/LEXIMATE-BACKEND/docker-compose.yaml) - Stack de producción
- [`.env.production`](file:///c:/Users/sr-robot/OneDrive/Documentos/LEXIMATE/LEXIMATE-FRONTEND/.env.production) - Env vars producción
- [`nginx.conf`](file:///c:/Users/sr-robot/OneDrive/Documentos/LEXIMATE/LEXIMATE-BACKEND/nginx/nginx.conf) - Reverse proxy config
