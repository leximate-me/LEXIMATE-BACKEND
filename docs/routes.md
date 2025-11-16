# API Routes Reference

Documentación simplificada de todos los endpoints del backend.

## Leyenda

- 🔓 = Endpoint público (sin autenticación)
- 🔐 = Endpoint protegido (requiere token JWT)
- `Bearer <TOKEN>` = Header requerido: `Authorization: Bearer <JWT_TOKEN>`

---

## Auth - Autenticación 🔓

### Registrar usuario

```
POST /api/auth/register
Content-Type: application/json

{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "password": "string"
}

Response: { id, email, first_name, last_name, created_at }
```

### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response: { token, user: { id, email, first_name, last_name } }
```

### Obtener perfil 🔐

```
GET /api/auth/profile
Bearer <TOKEN>

Response: { id, email, first_name, last_name, created_at, updated_at }
```

---

## Users - Usuarios 🔐

### Listar usuarios

```
GET /api/users
Bearer <TOKEN>
Query params: ?page=1&limit=10

Response: { users: [...], total, page, limit }
```

### Obtener usuario por ID

```
GET /api/users/:id
Bearer <TOKEN>

Response: { id, email, first_name, last_name, created_at }
```

### Actualizar usuario

```
PATCH /api/users/:id
Bearer <TOKEN>
Content-Type: application/json

{
  "first_name": "string?",
  "last_name": "string?",
  "email": "string?"
}

Response: { id, email, first_name, last_name, updated_at }
```

### Eliminar usuario

```
DELETE /api/users/:id
Bearer <TOKEN>

Response: { success: true }
```

---

## Courses - Cursos 🔐

### Listar cursos

```
GET /api/courses
Bearer <TOKEN>
Query params: ?page=1&limit=10&user_id=uuid?

Response: { courses: [...], total, page, limit }
```

### Crear curso

```
POST /api/courses
Bearer <TOKEN>
Content-Type: application/json

{
  "name": "string",
  "description": "string?",
  "instructor_id": "uuid"
}

Response: { id, name, description, instructor_id, created_at }
```

### Obtener curso

```
GET /api/courses/:id
Bearer <TOKEN>

Response: { id, name, description, instructor_id, created_at, updated_at }
```

### Actualizar curso

```
PATCH /api/courses/:id
Bearer <TOKEN>
Content-Type: application/json

{
  "name": "string?",
  "description": "string?"
}

Response: { id, name, description, instructor_id, updated_at }
```

### Eliminar curso

```
DELETE /api/courses/:id
Bearer <TOKEN>

Response: { success: true }
```

---

## Tasks - Tareas 🔐

### Listar tareas

```
GET /api/tasks
Bearer <TOKEN>
Query params: ?page=1&limit=10&course_id=uuid?&status=pending?

Response: { tasks: [...], total, page, limit }
```

### Crear tarea

```
POST /api/tasks
Bearer <TOKEN>
Content-Type: application/json

{
  "title": "string",
  "description": "string?",
  "course_id": "uuid",
  "status": "pending|in_progress|completed",
  "due_date": "ISO8601?"
}

Response: { id, title, description, course_id, status, due_date, created_at }
```

### Obtener tarea

```
GET /api/tasks/:id
Bearer <TOKEN>

Response: { id, title, description, course_id, status, due_date, created_at, updated_at }
```

### Actualizar tarea

```
PATCH /api/tasks/:id
Bearer <TOKEN>
Content-Type: application/json

{
  "title": "string?",
  "description": "string?",
  "status": "pending|in_progress|completed?",
  "due_date": "ISO8601?"
}

Response: { id, title, description, course_id, status, due_date, updated_at }
```

### Eliminar tarea

```
DELETE /api/tasks/:id
Bearer <TOKEN>

Response: { success: true }
```

---

## Posts - Posts 🔐

### Listar posts

```
GET /api/posts
Bearer <TOKEN>
Query params: ?page=1&limit=10&course_id=uuid?

Response: { posts: [...], total, page, limit }
```

### Crear post

```
POST /api/posts
Bearer <TOKEN>
Content-Type: application/json

{
  "title": "string",
  "content": "string",
  "course_id": "uuid",
  "author_id": "uuid"
}

Response: { id, title, content, course_id, author_id, created_at }
```

### Obtener post

```
GET /api/posts/:id
Bearer <TOKEN>

Response: { id, title, content, course_id, author_id, created_at, updated_at }
```

### Actualizar post

```
PATCH /api/posts/:id
Bearer <TOKEN>
Content-Type: application/json

{
  "title": "string?",
  "content": "string?"
}

Response: { id, title, content, course_id, author_id, updated_at }
```

### Eliminar post

```
DELETE /api/posts/:id
Bearer <TOKEN>

Response: { success: true }
```

---

## Comments - Comentarios 🔐

### Listar comentarios

```
GET /api/comments
Bearer <TOKEN>
Query params: ?page=1&limit=10&post_id=uuid?

Response: { comments: [...], total, page, limit }
```

### Crear comentario

```
POST /api/comments
Bearer <TOKEN>
Content-Type: application/json

{
  "content": "string",
  "post_id": "uuid",
  "author_id": "uuid"
}

Response: { id, content, post_id, author_id, created_at }
```

### Obtener comentario

```
GET /api/comments/:id
Bearer <TOKEN>

Response: { id, content, post_id, author_id, created_at, updated_at }
```

### Actualizar comentario

```
PATCH /api/comments/:id
Bearer <TOKEN>
Content-Type: application/json

{
  "content": "string?"
}

Response: { id, content, post_id, author_id, updated_at }
```

### Eliminar comentario

```
DELETE /api/comments/:id
Bearer <TOKEN>

Response: { success: true }
```

---

## Tools - Herramientas 🔐

### Extraer texto de PDF

```
POST /api/tools/extract-pdf
Bearer <TOKEN>
Content-Type: multipart/form-data

Form Data:
  file: <PDF File>

Response: { text: "string", pages: number }
```

### Extraer texto de PDF por URL

```
POST /api/tools/extract-pdf-url
Bearer <TOKEN>
Content-Type: application/json

{
  "url": "string"
}

Response: { text: "string", pages: number }
```

### Chatbot (Gemini)

```
POST /api/tools/chatbot
Bearer <TOKEN>
Content-Type: application/json

{
  "message": "string",
  "context": "string?"
}

Response: { response: "string" }
```

### Convertir Markdown a HTML

```
POST /api/tools/markdown-to-html
Bearer <TOKEN>
Content-Type: application/json

{
  "markdown": "string"
}

Response: { html: "string" }
```

### Obtener URL de Markdown

```
GET /api/tools/markdown-url/:id
Bearer <TOKEN>

Response: { url: "string" }
```

---

## Seed - Datos Iniciales 🔐

### Generar datos de prueba

```
POST /api/seed
Bearer <TOKEN>

Response: { success: true, message: "Seed data created" }
```

### Limpiar datos de prueba

```
DELETE /api/seed
Bearer <TOKEN>

Response: { success: true, message: "Seed data deleted" }
```

---

## Códigos de Estado HTTP

| Código | Significado                                  |
| ------ | -------------------------------------------- |
| 200    | OK - Solicitud exitosa                       |
| 201    | Created - Recurso creado                     |
| 204    | No Content - Solicitud exitosa sin contenido |
| 400    | Bad Request - Datos inválidos                |
| 401    | Unauthorized - Token inválido o expirado     |
| 403    | Forbidden - Sin permisos                     |
| 404    | Not Found - Recurso no encontrado            |
| 500    | Internal Server Error - Error del servidor   |

---

## Errores Comunes

```json
{
  "statusCode": 400,
  "message": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Invalid or expired token"
}
```
