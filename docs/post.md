# Documentación de Rutas del Módulo de Posts

Este documento detalla las rutas disponibles en el módulo de Posts. Para cada
ruta, se proporciona una descripción, los parámetros esperados y ejemplos de
cuerpos de solicitud y respuesta en formato JSON.

---

## Rutas Principales del Módulo de Posts

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
