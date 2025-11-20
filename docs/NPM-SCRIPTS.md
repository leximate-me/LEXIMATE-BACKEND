# 🚀 Scripts NPM para Docker - Leximate

## Comandos Rápidos (Shortcuts)

### Desarrollo (Hot-Reload)
```bash
npm run dev
```
Inicia todo el stack en modo desarrollo con hot-reload

### Producción
```bash
npm run prod
```
Inicia todo el stack en modo producción optimizado

---

## Comandos de Desarrollo (docker:dev:*)

### Iniciar y Detener

```bash
# Iniciar en desarrollo (con hot-reload)
npm run docker:dev:up

# Detener desarrollo
npm run docker:dev:down

# Reiniciar servicios
npm run docker:dev:restart

# Rebuild completo (después de cambios en package.json)
npm run docker:dev:rebuild
```

### Ver Logs

```bash
# Ver todos los logs
npm run docker:dev:logs

# Ver logs solo del frontend
npm run docker:dev:logs:frontend

# Ver logs solo del backend
npm run docker:dev:logs:backend
```

### Características
- ✅ Hot-reload para frontend (Vite HMR)
- ✅ Hot-reload para backend (nodemon)
- ✅ Puerto 5173 expuesto
- ✅ Código montado como volumen
- ✅ Cambios instantáneos

**Acceso:** http://localhost:5173

---

## Comandos de Producción (docker:prod:*)

### Iniciar y Detener

```bash
# Iniciar en producción
npm run docker:prod:up

# Detener producción
npm run docker:prod:down

# Rebuild completo
npm run docker:prod:rebuild
```

### Ver Logs

```bash
# Ver todos los logs
npm run docker:prod:logs

# Ver logs del frontend build
npm run docker:prod:logs:frontend

# Ver logs de nginx
npm run docker:prod:logs:nginx
```

### Características
- ✅ Build optimizado y minificado
- ✅ Nginx como reverse proxy
- ✅ Un solo puerto (80)
- ✅ Cercano a producción real

**Acceso:** http://localhost

---

## Comandos Existentes (Mantenidos)

### Base de Datos

```bash
# Levantar solo PostgreSQL
npm run docker:db:up

# Detener PostgreSQL
npm run docker:db:down

# Resetear base de datos (CUIDADO: borra datos)
npm run docker:db:reset

# Abrir shell de PostgreSQL
npm run docker:db:shell
```

### n8n

```bash
# Levantar solo n8n
npm run docker:n8n:up

# Detener n8n
npm run docker:n8n:down

# Resetear n8n (borra workflows)
npm run docker:n8n:reset
```

### Backend Individual

```bash
# Levantar solo backend
npm run docker:backend:up

# Detener backend
npm run docker:backend:down

# Reiniciar backend
npm run docker:backend:restart

# Rebuild backend (sin caché)
npm run docker:backend:rebuild
```

### Workflows n8n

```bash
# Cargar workflows
npm run docker:load:workflows

# Cargar credenciales
npm run docker:load:credentials

# Cargar todo (workflows + credenciales)
npm run docker:load:all
```

### Utilidades

```bash
# Ver estado de contenedores
npm run docker:status

# Limpiar todo (contenedores, volúmenes, imágenes no usadas)
npm run docker:clean

# Abrir shell en backend
npm run docker:shell:backend

# Abrir shell en postgres
npm run docker:shell:postgres

# Ver logs de todos los servicios
npm run docker:logs

# Ver logs específicos
npm run docker:logs:backend
npm run docker:logs:postgres
npm run docker:logs:n8n
```

---

## 📋 Tabla de Referencia Rápida

| Comando | Desarrollo | Producción |
|---------|------------|------------|
| **Iniciar** | `npm run dev` | `npm run prod` |
| **Detener** | `npm run docker:dev:down` | `npm run docker:prod:down` |
| **Logs** | `npm run docker:dev:logs` | `npm run docker:prod:logs` |
| **Rebuild** | `npm run docker:dev:rebuild` | `npm run docker:prod:rebuild` |
| **Puerto** | 5173 | 80 |
| **Hot-reload** | ✅ Sí | ❌ No |

---

## 💡 Ejemplos de Uso

### Flujo de Desarrollo Típico

```bash
# 1. Iniciar en desarrollo
cd LEXIMATE-BACKEND
npm run dev

# 2. Hacer cambios en el código
# Los cambios se reflejan automáticamente ⚡

# 3. Ver logs si hay errores
npm run docker:dev:logs:backend

# 4. Al terminar, detener
npm run docker:dev:down
```

### Probar Build de Producción

```bash
# 1. Iniciar en producción
npm run prod

# 2. Probar en http://localhost

# 3. Ver logs
npm run docker:prod:logs

# 4. Detener
npm run docker:prod:down
```

### Después de Instalar Paquetes

```bash
# Si agregaste paquetes en package.json, rebuild
npm run docker:dev:rebuild
```

### Debugging

```bash
# Ver qué contenedores están corriendo
npm run docker:status

# Ver logs en tiempo real
npm run docker:dev:logs

# Abrir shell en el backend (para debugging)
npm run docker:shell:backend
```

---

## 🔧 Troubleshooting

### Puerto en uso

Si ves error de puerto en uso:

**Desarrollo (puerto 5173):**
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force
```

**Producción (puerto 80):**
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 80).OwningProcess | Stop-Process -Force
```

### Cambios no se reflejan

**En desarrollo:**
```bash
# Verifica que estés usando el comando correcto
npm run dev  # NO npm run prod

# Si aún no funciona, rebuild
npm run docker:dev:rebuild
```

**En producción:**
```bash
# Producción siempre requiere rebuild
npm run docker:prod:rebuild
```

### Limpiar todo y empezar de cero

```bash
# Detener todo
npm run docker:dev:down
npm run docker:prod:down

# Limpiar volúmenes e imágenes
npm run docker:clean

# Iniciar de nuevo
npm run dev
```

---

## 📚 Más Información

- [DESARROLLO-VS-PRODUCCION.md](file:///c:/Users/sr-robot/OneDrive/Documentos/LEXIMATE/DESARROLLO-VS-PRODUCCION.md) - Guía completa
- [README-DOCKER.md](file:///c:/Users/sr-robot/OneDrive/Documentos/LEXIMATE/README-DOCKER.md) - Documentación de producción
