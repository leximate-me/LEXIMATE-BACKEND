### POST /

**Descripción:** Crea un nuevo comentario. Requiere autenticación y roles de
'student' o 'teacher'.

**Cuerpo de la Solicitud (Request Body):** `Content-Type: application/json`

```json
{
  "content": "Este es un nuevo comentario."
}
```

**Respuestas:**

- **201 Created**: Comentario creado exitosamente.
  `Content-Type: application/json`
  ```json
  {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "content": "Este es un nuevo comentario.",
    "post": {
      "id": "post-id-example",
      "title": "Título del Post",
      "content": "Contenido del Post"
    },
    "users": {
      "id": "user-id-example",
      "email": "user@example.com",
      "name": "Nombre de Usuario"
    },
    "deletedAt": null
  }
  ```
- **400 Bad Request**: Error de validación en el cuerpo de la solicitud.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": ["El contenido es obligatorio y debe tener al menos 1 caracter"]
  }
  ```
- **401 Unauthorized**: No autenticado. `Content-Type: application/json`
  ```json
  {
    "statusCode": 401,
    "error": "Unauthorized",
    "message": "Unauthorized"
  }
  ```
- **403 Forbidden**: El usuario no tiene los roles requeridos.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 403,
    "error": "Forbidden",
    "message": "Forbidden resource"
  }
  ```

### GET /

**Descripción:** Obtiene todos los comentarios. Requiere autenticación y roles
de 'student' o 'teacher'.

**Respuestas:**

- **200 OK**: Lista de comentarios obtenida exitosamente.
  `Content-Type: application/json`
  ```json
  [
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "content": "Contenido del comentario 1",
      "post": {
        "id": "post-id-example-1",
        "title": "Título del Post 1",
        "content": "Contenido del Post 1"
      },
      "users": {
        "id": "user-id-example-1",
        "email": "user1@example.com",
        "name": "Usuario Uno"
      },
      "deletedAt": null
    },
    {
      "id": "b2c3d4e5-f6a7-8901-2345-67890abcdef0",
      "content": "Contenido del comentario 2",
      "post": {
        "id": "post-id-example-2",
        "title": "Título del Post 2",
        "content": "Contenido del Post 2"
      },
      "users": {
        "id": "user-id-example-2",
        "email": "user2@example.com",
        "name": "Usuario Dos"
      },
      "deletedAt": null
    }
  ]
  ```
- **401 Unauthorized**: No autenticado. `Content-Type: application/json`
  ```json
  {
    "statusCode": 401,
    "error": "Unauthorized",
    "message": "Unauthorized"
  }
  ```
- **403 Forbidden**: El usuario no tiene los roles requeridos.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 403,
    "error": "Forbidden",
    "message": "Forbidden resource"
  }
  ```

### GET /:commentId

**Descripción:** Obtiene un comentario específico por su ID. Requiere
autenticación y roles de 'student' o 'teacher'.

**Parámetros:**

- `commentId`: (Path) (string) (Requerido) El ID único del comentario.

**Respuestas:**

- **200 OK**: Comentario obtenido exitosamente. `Content-Type: application/json`
  ```json
  {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "content": "Contenido del comentario",
    "post": {
      "id": "post-id-example",
      "title": "Título del Post",
      "content": "Contenido del Post"
    },
    "users": {
      "id": "user-id-example",
      "email": "user@example.com",
      "name": "Nombre de Usuario"
    },
    "deletedAt": null
  }
  ```
- **404 Not Found**: Comentario no encontrado. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Comment with id 'non-existent-id' not found"
  }
  ```
- **401 Unauthorized**: No autenticado. `Content-Type: application/json`
  ```json
  {
    "statusCode": 401,
    "error": "Unauthorized",
    "message": "Unauthorized"
  }
  ```
- **403 Forbidden**: El usuario no tiene los roles requeridos.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 403,
    "error": "Forbidden",
    "message": "Forbidden resource"
  }
  ```

### PUT /:commentId

**Descripción:** Actualiza un comentario existente por su ID. Requiere
autenticación y roles de 'student' o 'teacher'.

**Parámetros:**

- `commentId`: (Path) (string) (Requerido) El ID único del comentario a
  actualizar.

**Cuerpo de la Solicitud (Request Body):** `Content-Type: application/json`

```json
{
  "content": "Contenido del comentario actualizado."
}
```

**Respuestas:**

- **200 OK**: Comentario actualizado exitosamente.
  `Content-Type: application/json`
  ```json
  {
    "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "content": "Contenido del comentario actualizado.",
    "post": {
      "id": "post-id-example",
      "title": "Título del Post",
      "content": "Contenido del Post"
    },
    "users": {
      "id": "user-id-example",
      "email": "user@example.com",
      "name": "Nombre de Usuario"
    },
    "deletedAt": null
  }
  ```
- **400 Bad Request**: Error de validación en el cuerpo de la solicitud.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": ["El contenido debe tener al menos 1 caracter"]
  }
  ```
- **404 Not Found**: Comentario no encontrado. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Comment with id 'non-existent-id' not found"
  }
  ```
- **401 Unauthorized**: No autenticado. `Content-Type: application/json`
  ```json
  {
    "statusCode": 401,
    "error": "Unauthorized",
    "message": "Unauthorized"
  }
  ```
- **403 Forbidden**: El usuario no tiene los roles requeridos.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 403,
    "error": "Forbidden",
    "message": "Forbidden resource"
  }
  ```

### DELETE /:commentId

**Descripción:** Elimina un comentario por su ID. Requiere autenticación y roles
de 'student' o 'teacher'.

**Parámetros:**

- `commentId`: (Path) (string) (Requerido) El ID único del comentario a
  eliminar.

**Respuestas:**

- **204 No Content**: Comentario eliminado exitosamente (no devuelve contenido).
- **404 Not Found**: Comentario no encontrado. `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "Comment with id 'non-existent-id' not found"
  }
  ```
- **401 Unauthorized**: No autenticado. `Content-Type: application/json`
  ```json
  {
    "statusCode": 401,
    "error": "Unauthorized",
    "message": "Unauthorized"
  }
  ```
- **403 Forbidden**: El usuario no tiene los roles requeridos.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 403,
    "error": "Forbidden",
    "message": "Forbidden resource"
  }
  ```
