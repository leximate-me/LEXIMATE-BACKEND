# Documentación de Rutas del Módulo de Cursos

Este documento detalla las rutas disponibles en el módulo de Cursos, incluyendo
sus rutas anidadas para Tareas, Posts y Comentarios. Para cada ruta, se
proporciona una descripción, los parámetros esperados y ejemplos de cuerpos de
solicitud y respuesta en formato JSON.

---

## Rutas Principales del Módulo de Cursos

### POST /

**Descripción:** Crea un nuevo curso con un nombre y una descripción.

**Parámetros:** Ninguno

**Cuerpo de la Solicitud (Request Body):** `Content-Type: application/json`

```json
{
  "name": "Introducción a la Programación",
  "description": "Un curso para principiantes en programación."
}
```

**Respuestas:**

- **201**: Curso creado exitosamente. `Content-Type: application/json`
  ```json
  {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "name": "Introducción a la Programación",
    "description": "Un curso para principiantes en programación.",
    "class_code": "ABCDE12345",
    "deletedAt": null,
    "tasks": [],
    "posts": [],
    "users": []
  }
  ```
- **400**: Error de validación en los datos proporcionados.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": ["El nombre es obligatorio y debe ser texto"]
  }
  ```

### POST /join

**Descripción:** Permite a un usuario unirse a un curso existente utilizando un
código de clase.

**Parámetros:** Ninguno

**Cuerpo de la Solicitud (Request Body):** `Content-Type: application/json`

```json
{
  "class_code": "ABCDE12345"
}
```

**Respuestas:**

- **200**: Usuario unido al curso exitosamente. `Content-Type: application/json`
  ```json
  {
    "message": "Usuario unido al curso exitosamente."
  }
  ```
- **400**: Código de clase inválido o el usuario ya está en el curso.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": "Código de clase inválido o ya estás en el curso."
  }
  ```
- **404**: Curso no encontrado con el código proporcionado.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Curso no encontrado."
  }
  ```

### POST /:courseId/leave

**Descripción:** Permite a un usuario salir de un curso específico.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.

**Cuerpo de la Solicitud (Request Body):** Ninguno

**Respuestas:**

- **200**: Usuario ha salido del curso exitosamente.
  `Content-Type: application/json`
  ```json
  {
    "message": "Usuario ha salido del curso exitosamente."
  }
  ```
- **404**: Curso no encontrado o el usuario no pertenece al curso.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Curso no encontrado o el usuario no pertenece al curso."
  }
  ```

### GET /user

**Descripción:** Obtiene todos los cursos a los que el usuario autenticado está
inscrito.

**Parámetros:** Ninguno

**Cuerpo de la Solicitud (Request Body):** Ninguno

**Respuestas:**

- **200**: Lista de cursos a los que el usuario pertenece.
  `Content-Type: application/json`
  ```json
  [
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "name": "Introducción a la Programación",
      "description": "Un curso para principiantes en programación.",
      "class_code": "ABCDE12345",
      "deletedAt": null
    },
    {
      "id": "b2c3d4e5-f6a7-8901-2345-67890abcdef0",
      "name": "Matemáticas Avanzadas",
      "description": "Curso de cálculo y álgebra lineal.",
      "class_code": "FGHIJ67890",
      "deletedAt": null
    }
  ]
  ```
- **401**: No autorizado, el usuario no ha iniciado sesión.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 401,
    "error": "Unauthorized",
    "message": "No autorizado."
  }
  ```

### GET /:courseId/user

**Descripción:** Obtiene la lista de usuarios inscritos en un curso específico.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.

**Cuerpo de la Solicitud (Request Body):** Ninguno

**Respuestas:**

- **200**: Lista de usuarios inscritos en el curso.
  `Content-Type: application/json`
  ```json
  [
    {
      "id": "user1-uuid",
      "email": "usuario1@example.com",
      "name": "Usuario Uno"
    },
    {
      "id": "user2-uuid",
      "email": "usuario2@example.com",
      "name": "Usuario Dos"
    }
  ]
  ```
- **404**: Curso no encontrado. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Curso no encontrado."
  }
  ```

### PUT /:courseId

**Descripción:** Actualiza la información de un curso existente.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso a actualizar.

**Cuerpo de la Solicitud (Request Body):** `Content-Type: application/json`

```json
{
  "name": "Programación Avanzada",
  "description": "Un curso avanzado de programación."
}
```

**Respuestas:**

- **200**: Curso actualizado exitosamente. `Content-Type: application/json`
  ```json
  {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "name": "Programación Avanzada",
    "description": "Un curso avanzado de programación.",
    "class_code": "ABCDE12345",
    "deletedAt": null,
    "tasks": [],
    "posts": [],
    "users": []
  }
  ```
- **400**: Error de validación en los datos proporcionados.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": ["El nombre debe tener al menos 1 caracter"]
  }
  ```
- **404**: Curso no encontrado. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Curso no encontrado."
  }
  ```

### DELETE /:courseId

**Descripción:** Elimina un curso existente.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso a eliminar.

**Cuerpo de la Solicitud (Request Body):** Ninguno

**Respuestas:**

- **200**: Curso eliminado exitosamente. `Content-Type: application/json`
  ```json
  {
    "message": "Curso eliminado exitosamente."
  }
  ```
- **404**: Curso no encontrado. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Curso no encontrado."
  }
  ```

---

## Rutas Anidadas de Tareas (bajo `/:courseId/task`)

### POST /:courseId/task

**Descripción:** Crea una nueva tarea dentro de un curso específico.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso al que se asociará
  la tarea.

**Cuerpo de la Solicitud (Request Body):** `Content-Type: application/json`

```json
{
  "title": "Tarea 1: Fundamentos de JavaScript",
  "description": "Realizar ejercicios básicos de JavaScript.",
  "due_date": "2025-12-31T23:59:59Z"
}
```

**Respuestas:**

- **201**: Tarea creada exitosamente. `Content-Type: application/json`
  ```json
  {
    "id": "task-uuid-1",
    "title": "Tarea 1: Fundamentos de JavaScript",
    "description": "Realizar ejercicios básicos de JavaScript.",
    "status": false,
    "due_date": "2025-12-31T23:59:59.000Z",
    "deletedAt": null,
    "course": {
      "id": "course-uuid",
      "name": "Introducción a la Programación"
    },
    "taskFiles": [],
    "submissions": []
  }
  ```
- **400**: Error de validación en los datos proporcionados.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": ["El nombre es obligatorio y debe tener al menos 4 caracteres"]
  }
  ```
- **404**: Curso no encontrado. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Curso no encontrado."
  }
  ```

### PUT /:courseId/task/:taskId

**Descripción:** Actualiza la información de una tarea específica dentro de un
curso.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.
- `taskId`: (path) (string) (requerido) ID único de la tarea a actualizar.

**Cuerpo de la Solicitud (Request Body):** `Content-Type: application/json`

```json
{
  "title": "Tarea 1: Fundamentos de JavaScript (Actualizada)",
  "description": "Realizar ejercicios básicos de JavaScript y Node.js.",
  "status": true,
  "due_date": "2026-01-15T23:59:59Z"
}
```

**Respuestas:**

- **200**: Tarea actualizada exitosamente. `Content-Type: application/json`
  ```json
  {
    "id": "task-uuid-1",
    "title": "Tarea 1: Fundamentos de JavaScript (Actualizada)",
    "description": "Realizar ejercicios básicos de JavaScript y Node.js.",
    "status": true,
    "due_date": "2026-01-15T23:59:59.000Z",
    "deletedAt": null,
    "course": {
      "id": "course-uuid",
      "name": "Introducción a la Programación"
    },
    "taskFiles": [],
    "submissions": []
  }
  ```
- **400**: Error de validación en los datos proporcionados.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": ["El título debe tener al menos 4 caracteres"]
  }
  ```
- **404**: Curso o tarea no encontrados. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Tarea no encontrada."
  }
  ```

### DELETE /:courseId/task/:taskId

**Descripción:** Elimina una tarea específica de un curso.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.
- `taskId`: (path) (string) (requerido) ID único de la tarea a eliminar.

**Cuerpo de la Solicitud (Request Body):** Ninguno

**Respuestas:**

- **200**: Tarea eliminada exitosamente. `Content-Type: application/json`
  ```json
  {
    "message": "Tarea eliminada exitosamente."
  }
  ```
- **404**: Curso o tarea no encontrados. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Tarea no encontrada."
  }
  ```

### POST /:courseId/task/:taskId/submissions

**Descripción:** Crea una nueva entrega para una tarea específica.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.
- `taskId`: (path) (string) (requerido) ID único de la tarea a la que se asocia
  la entrega.

**Cuerpo de la Solicitud (Request Body):** `Content-Type: application/json`

```json
{
  "comment": "Adjunto mi solución para la tarea.",
  "status": "PENDING"
}
```

**Respuestas:**

- **201**: Entrega creada exitosamente. `Content-Type: application/json`
  ```json
  {
    "id": "submission-uuid-1",
    "comment": "Adjunto mi solución para la tarea.",
    "status": "PENDING",
    "qualification": null,
    "deletedAt": null,
    "task": {
      "id": "task-uuid-1",
      "title": "Tarea 1: Fundamentos de JavaScript"
    },
    "user": {
      "id": "user-uuid",
      "email": "usuario@example.com"
    }
  }
  ```
- **400**: Error de validación en los datos proporcionados.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": ["El estado de la tarea debe ser un valor válido."]
  }
  ```
- **404**: Curso o tarea no encontrados. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Tarea no encontrada."
  }
  ```

### GET /:courseId/task/:taskId/submissions

**Descripción:** Obtiene todas las entregas para una tarea específica.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.
- `taskId`: (path) (string) (requerido) ID único de la tarea.

**Cuerpo de la Solicitud (Request Body):** Ninguno

**Respuestas:**

- **200**: Lista de entregas para la tarea. `Content-Type: application/json`
  ```json
  [
    {
      "id": "submission-uuid-1",
      "comment": "Adjunto mi solución para la tarea.",
      "status": "PENDING",
      "qualification": null,
      "deletedAt": null,
      "user": {
        "id": "user-uuid-1",
        "email": "estudiante1@example.com",
        "name": "Estudiante Uno"
      }
    },
    {
      "id": "submission-uuid-2",
      "comment": "Mi segunda entrega.",
      "status": "GRADED",
      "qualification": 95,
      "deletedAt": null,
      "user": {
        "id": "user-uuid-2",
        "email": "estudiante2@example.com",
        "name": "Estudiante Dos"
      }
    }
  ]
  ```
- **404**: Curso o tarea no encontrados. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Tarea no encontrada."
  }
  ```

### GET /:courseId/task

**Descripción:** Obtiene todas las tareas asociadas a un curso específico.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.

**Cuerpo de la Solicitud (Request Body):** Ninguno

**Respuestas:**

- **200**: Lista de tareas del curso. `Content-Type: application/json`
  ```json
  [
    {
      "id": "task-uuid-1",
      "title": "Tarea 1: Fundamentos de JavaScript",
      "description": "Realizar ejercicios básicos de JavaScript.",
      "status": false,
      "due_date": "2025-12-31T23:59:59.000Z",
      "deletedAt": null
    },
    {
      "id": "task-uuid-2",
      "title": "Tarea 2: Introducción a Node.js",
      "description": "Crear un servidor básico con Node.js.",
      "status": false,
      "due_date": "2026-01-15T23:59:59.000Z",
      "deletedAt": null
    }
  ]
  ```
- **404**: Curso no encontrado. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Curso no encontrado."
  }
  ```

### GET /:courseId/task/:taskId

**Descripción:** Obtiene los detalles de una tarea específica dentro de un
curso.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.
- `taskId`: (path) (string) (requerido) ID único de la tarea a obtener.

**Cuerpo de la Solicitud (Request Body):** Ninguno

**Respuestas:**

- **200**: Detalles de la tarea. `Content-Type: application/json`
  ```json
  {
    "id": "task-uuid-1",
    "title": "Tarea 1: Fundamentos de JavaScript",
    "description": "Realizar ejercicios básicos de JavaScript.",
    "status": false,
    "due_date": "2025-12-31T23:59:59.000Z",
    "deletedAt": null,
    "course": {
      "id": "course-uuid",
      "name": "Introducción a la Programación"
    },
    "taskFiles": [],
    "submissions": []
  }
  ```
- **404**: Curso o tarea no encontrados. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Tarea no encontrada."
  }
  ```

### PUT /:courseId/task/submissions/:submissionId

**Descripción:** Actualiza una entrega de tarea específica.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.
- `submissionId`: (path) (string) (requerido) ID único de la entrega a
  actualizar.

**Cuerpo de la Solicitud (Request Body):** `Content-Type: application/json`

```json
{
  "comment": "Excelente trabajo, pero revisa el punto 3.",
  "status": "GRADED",
  "qualification": 85
}
```

**Respuestas:**

- **200**: Entrega actualizada exitosamente. `Content-Type: application/json`
  ```json
  {
    "id": "submission-uuid-1",
    "comment": "Excelente trabajo, pero revisa el punto 3.",
    "status": "GRADED",
    "qualification": 85,
    "deletedAt": null,
    "task": {
      "id": "task-uuid-1",
      "title": "Tarea 1: Fundamentos de JavaScript"
    },
    "user": {
      "id": "user-uuid",
      "email": "usuario@example.com"
    }
  }
  ```
- **400**: Error de validación en los datos proporcionados.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": ["La calificación debe ser un número."]
  }
  ```
- **404**: Curso o entrega no encontrados. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Entrega no encontrada."
  }
  ```

### DELETE /:courseId/task/submissions/:submissionId

**Descripción:** Elimina una entrega de tarea específica.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.
- `submissionId`: (path) (string) (requerido) ID único de la entrega a eliminar.

**Cuerpo de la Solicitud (Request Body):** Ninguno

**Respuestas:**

- **200**: Entrega eliminada exitosamente. `Content-Type: application/json`
  ```json
  {
    "message": "Entrega eliminada exitosamente."
  }
  ```
- **404**: Curso o entrega no encontrados. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Entrega no encontrada."
  }
  ```

---

## Rutas Anidadas de Posts (bajo `/:courseId/post`)

### POST /:courseId/post

**Descripción:** Crea una nueva publicación dentro de un curso específico.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso al que se asociará
  la publicación.

**Cuerpo de la Solicitud (Request Body):** `Content-Type: application/json`

```json
{
  "title": "Anuncio Importante",
  "content": "Hoy tendremos una sesión extra de consulta a las 5 PM."
}
```

**Respuestas:**

- **201**: Publicación creada exitosamente. `Content-Type: application/json`
  ```json
  {
    "id": "post-uuid-1",
    "title": "Anuncio Importante",
    "content": "Hoy tendremos una sesión extra de consulta a las 5 PM.",
    "deletedAt": null,
    "course": {
      "id": "course-uuid",
      "name": "Introducción a la Programación"
    },
    "user": {
      "id": "user-uuid",
      "email": "profesor@example.com"
    },
    "comments": []
  }
  ```
- **400**: Error de validación en los datos proporcionados.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": ["El título es obligatorio y debe tener al menos 1 caracter"]
  }
  ```
- **404**: Curso no encontrado. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Curso no encontrado."
  }
  ```

### GET /:courseId/post

**Descripción:** Obtiene todas las publicaciones de un curso específico.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.

**Cuerpo de la Solicitud (Request Body):** Ninguno

**Respuestas:**

- **200**: Lista de publicaciones del curso. `Content-Type: application/json`
  ```json
  [
    {
      "id": "post-uuid-1",
      "title": "Anuncio Importante",
      "content": "Hoy tendremos una sesión extra de consulta a las 5 PM.",
      "deletedAt": null,
      "user": {
        "id": "user-uuid-1",
        "email": "profesor1@example.com",
        "name": "Profesor Uno"
      }
    },
    {
      "id": "post-uuid-2",
      "title": "Material de Lectura",
      "content": "Se ha subido nuevo material sobre estructuras de datos.",
      "deletedAt": null,
      "user": {
        "id": "user-uuid-2",
        "email": "profesor2@example.com",
        "name": "Profesor Dos"
      }
    }
  ]
  ```
- **404**: Curso no encontrado. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Curso no encontrado."
  }
  ```

### GET /:courseId/post/:postId

**Descripción:** Obtiene los detalles de una publicación específica dentro de un
curso.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.
- `postId`: (path) (string) (requerido) ID único de la publicación a obtener.

**Cuerpo de la Solicitud (Request Body):** Ninguno

**Respuestas:**

- **200**: Detalles de la publicación. `Content-Type: application/json`
  ```json
  {
    "id": "post-uuid-1",
    "title": "Anuncio Importante",
    "content": "Hoy tendremos una sesión extra de consulta a las 5 PM.",
    "deletedAt": null,
    "course": {
      "id": "course-uuid",
      "name": "Introducción a la Programación"
    },
    "user": {
      "id": "user-uuid",
      "email": "profesor@example.com"
    },
    "comments": []
  }
  ```
- **404**: Curso o publicación no encontrados. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Publicación no encontrada."
  }
  ```

### PUT /:courseId/post/:postId

**Descripción:** Actualiza la información de una publicación específica dentro
de un curso.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.
- `postId`: (path) (string) (requerido) ID único de la publicación a actualizar.

**Cuerpo de la Solicitud (Request Body):** `Content-Type: application/json`

```json
{
  "title": "Anuncio Importante (Actualizado)",
  "content": "La sesión extra de consulta será mañana a las 6 PM."
}
```

**Respuestas:**

- **200**: Publicación actualizada exitosamente.
  `Content-Type: application/json`
  ```json
  {
    "id": "post-uuid-1",
    "title": "Anuncio Importante (Actualizado)",
    "content": "La sesión extra de consulta será mañana a las 6 PM.",
    "deletedAt": null,
    "course": {
      "id": "course-uuid",
      "name": "Introducción a la Programación"
    },
    "user": {
      "id": "user-uuid",
      "email": "profesor@example.com"
    },
    "comments": []
  }
  ```
- **400**: Error de validación en los datos proporcionados.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": ["El título debe tener al menos 1 caracter"]
  }
  ```
- **404**: Curso o publicación no encontrados. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Publicación no encontrada."
  }
  ```

### DELETE /:courseId/post/:postId

**Descripción:** Elimina una publicación específica de un curso.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.
- `postId`: (path) (string) (requerido) ID único de la publicación a eliminar.

**Cuerpo de la Solicitud (Request Body):** Ninguno

**Respuestas:**

- **200**: Publicación eliminada exitosamente. `Content-Type: application/json`
  ```json
  {
    "message": "Publicación eliminada exitosamente."
  }
  ```
- **404**: Curso o publicación no encontrados. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Publicación no encontrada."
  }
  ```

---

## Rutas Anidadas de Comentarios (bajo `/:courseId/post/:postId/comment`)

### POST /:courseId/post/:postId/comment

**Descripción:** Crea un nuevo comentario en una publicación específica dentro
de un curso.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.
- `postId`: (path) (string) (requerido) ID único de la publicación a la que se
  asociará el comentario.

**Cuerpo de la Solicitud (Request Body):** `Content-Type: application/json`

```json
{
  "content": "¡Excelente publicación! Muy útil la información."
}
```

**Respuestas:**

- **201**: Comentario creado exitosamente. `Content-Type: application/json`
  ```json
  {
    "id": "comment-uuid-1",
    "content": "¡Excelente publicación! Muy útil la información.",
    "deletedAt": null,
    "post": {
      "id": "post-uuid-1",
      "title": "Anuncio Importante"
    },
    "users": {
      "id": "user-uuid",
      "email": "usuario@example.com"
    }
  }
  ```
- **400**: Error de validación en los datos proporcionados.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": ["El contenido es obligatorio y debe tener al menos 1 caracter"]
  }
  ```
- **404**: Curso o publicación no encontrados. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Publicación no encontrada."
  }
  ```

### GET /:courseId/post/:postId/comment

**Descripción:** Obtiene todos los comentarios de una publicación específica
dentro de un curso.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.
- `postId`: (path) (string) (requerido) ID único de la publicación.

**Cuerpo de la Solicitud (Request Body):** Ninguno

**Respuestas:**

- **200**: Lista de comentarios de la publicación.
  `Content-Type: application/json`
  ```json
  [
    {
      "id": "comment-uuid-1",
      "content": "¡Excelente publicación! Muy útil la información.",
      "deletedAt": null,
      "users": {
        "id": "user-uuid-1",
        "email": "estudiante1@example.com",
        "name": "Estudiante Uno"
      }
    },
    {
      "id": "comment-uuid-2",
      "content": "Gracias por la aclaración.",
      "deletedAt": null,
      "users": {
        "id": "user-uuid-2",
        "email": "estudiante2@example.com",
        "name": "Estudiante Dos"
      }
    }
  ]
  ```
- **404**: Curso o publicación no encontrados. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Publicación no encontrada."
  }
  ```

### GET /:courseId/post/:postId/comment/:commentId

**Descripción:** Obtiene los detalles de un comentario específico dentro de una
publicación y un curso.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.
- `postId`: (path) (string) (requerido) ID único de la publicación.
- `commentId`: (path) (string) (requerido) ID único del comentario a obtener.

**Cuerpo de la Solicitud (Request Body):** Ninguno

**Respuestas:**

- **200**: Detalles del comentario. `Content-Type: application/json`
  ```json
  {
    "id": "comment-uuid-1",
    "content": "¡Excelente publicación! Muy útil la información.",
    "deletedAt": null,
    "post": {
      "id": "post-uuid-1",
      "title": "Anuncio Importante"
    },
    "users": {
      "id": "user-uuid",
      "email": "usuario@example.com"
    }
  }
  ```
- **404**: Curso, publicación o comentario no encontrados.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Comentario no encontrado."
  }
  ```

### PUT /:courseId/post/:postId/comment/:commentId

**Descripción:** Actualiza el contenido de un comentario específico.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.
- `postId`: (path) (string) (requerido) ID único de la publicación.
- `commentId`: (path) (string) (requerido) ID único del comentario a actualizar.

**Cuerpo de la Solicitud (Request Body):** `Content-Type: application/json`

```json
{
  "content": "¡Excelente publicación! Muy útil la información. (Editado)"
}
```

**Respuestas:**

- **200**: Comentario actualizado exitosamente. `Content-Type: application/json`
  ```json
  {
    "id": "comment-uuid-1",
    "content": "¡Excelente publicación! Muy útil la información. (Editado)",
    "deletedAt": null,
    "post": {
      "id": "post-uuid-1",
      "title": "Anuncio Importante"
    },
    "users": {
      "id": "user-uuid",
      "email": "usuario@example.com"
    }
  }
  ```
- **400**: Error de validación en los datos proporcionados.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": ["El contenido debe tener al menos 1 caracter"]
  }
  ```
- **404**: Curso, publicación o comentario no encontrados.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Comentario no encontrado."
  }
  ```

### DELETE /:courseId/post/:postId/comment/:commentId

**Descripción:** Elimina un comentario específico de una publicación.

**Parámetros:**

- `courseId`: (path) (string) (requerido) ID único del curso.
- `postId`: (path) (string) (requerido) ID único de la publicación.
- `commentId`: (path) (string) (requerido) ID único del comentario a eliminar.

**Cuerpo de la Solicitud (Request Body):** Ninguno

**Respuestas:**

- **200**: Comentario eliminado exitosamente. `Content-Type: application/json`
  ```json
  {
    "message": "Comentario eliminado exitosamente."
  }
  ```
- **404**: Curso, publicación o comentario no encontrados.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Comentario no encontrado."
  }
  ```
