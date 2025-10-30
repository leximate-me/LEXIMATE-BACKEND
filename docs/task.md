# Documentación de Rutas del Módulo de Tareas

Este documento detalla las rutas disponibles en el módulo de Tareas. Para cada
ruta, se proporciona una descripción, los parámetros esperados y ejemplos de
cuerpos de solicitud y respuesta en formato JSON.

---

## Rutas Principales del Módulo de Tareas

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
