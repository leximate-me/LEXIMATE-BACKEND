### POST /register

**Descripción:** Registra un nuevo usuario en el sistema.

**Parámetros:**

**Cuerpo de la Solicitud (Request Body):** `Content-Type: application/json`

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "dni": "12345678",
  "institute": "Universidad Ejemplo",
  "phone_number": "1122334455",
  "birth_date": "1990-01-01",
  "user_name": "johndoe",
  "email": "john.doe@example.com",
  "password": "Password123-$"
}
```

**Respuestas:**

- **201**: Usuario registrado exitosamente. `Content-Type: application/json`
  ```json
  {
    "message": "Usuario registrado exitosamente. Por favor, verifica tu correo electrónico."
  }
  ```
- **400**: Error de validación o usuario ya existe.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "message": "El email o nombre de usuario ya está en uso."
  }
  ```

### POST /login

**Descripción:** Inicia sesión de un usuario y devuelve un token de
autenticación.

**Parámetros:**

**Cuerpo de la Solicitud (Request Body):** `Content-Type: application/json`

```json
{
  "email": "john.doe@example.com",
  "password": "Password123-$"
}
```

**Respuestas:**

- **200**: Inicio de sesión exitoso. `Content-Type: application/json`
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-del-usuario",
      "user_name": "johndoe",
      "email": "john.doe@example.com",
      "verified": true,
      "people": {
        "id": "uuid-de-people",
        "first_name": "John",
        "last_name": "Doe",
        "dni": "12345678",
        "institute": "Universidad Ejemplo",
        "phone_number": "1122334455",
        "birth_date": "1990-01-01T00:00:00.000Z"
      },
      "role": {
        "id": "uuid-del-rol",
        "name": "student"
      },
      "userFiles": []
    }
  }
  ```
- **401**: Credenciales inválidas. `Content-Type: application/json`
  ```json
  {
    "statusCode": 401,
    "message": "Credenciales inválidas"
  }
  ```
- **400**: Error de validación. `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "message": "Bad Request"
  }
  ```

### GET /verify-token

**Descripción:** Verifica la validez del token de autenticación actual.

**Parámetros:**

**Cuerpo de la Solicitud (Request Body):**

**Respuestas:**

- **200**: Token válido. `Content-Type: application/json`
  ```json
  {
    "message": "Token válido",
    "user": {
      "id": "uuid-del-usuario",
      "user_name": "johndoe",
      "email": "john.doe@example.com",
      "verified": true,
      "people": {
        "id": "uuid-de-people",
        "first_name": "John",
        "last_name": "Doe",
        "dni": "12345678",
        "institute": "Universidad Ejemplo",
        "phone_number": "1122334455",
        "birth_date": "1990-01-01T00:00:00.000Z"
      },
      "role": {
        "id": "uuid-del-rol",
        "name": "student"
      },
      "userFiles": []
    }
  }
  ```
- **401**: Token inválido o no proporcionado. `Content-Type: application/json`
  ```json
  {
    "statusCode": 401,
    "message": "No autorizado: Token no proporcionado o inválido."
  }
  ```

### POST /logout

**Descripción:** Cierra la sesión del usuario actual invalidando el token de
autenticación.

**Parámetros:**

**Cuerpo de la Solicitud (Request Body):**

**Respuestas:**

- **200**: Sesión cerrada exitosamente. `Content-Type: application/json`
  ```json
  {
    "message": "Sesión cerrada exitosamente."
  }
  ```
- **401**: No autorizado: Token no proporcionado o inválido.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 401,
    "message": "No autorizado: Token no proporcionado o inválido."
  }
  ```

### GET /profile

**Descripción:** Obtiene el perfil del usuario autenticado.

**Parámetros:**

**Cuerpo de la Solicitud (Request Body):**

**Respuestas:**

- **200**: Perfil del usuario obtenido exitosamente.
  `Content-Type: application/json`
  ```json
  {
    "id": "uuid-del-usuario",
    "user_name": "johndoe",
    "email": "john.doe@example.com",
    "verified": true,
    "people": {
      "id": "uuid-de-people",
      "first_name": "John",
      "last_name": "Doe",
      "dni": "12345678",
      "institute": "Universidad Ejemplo",
      "phone_number": "1122334455",
      "birth_date": "1990-01-01T00:00:00.000Z"
    },
    "role": {
      "id": "uuid-del-rol",
      "name": "student"
    },
    "userFiles": []
  }
  ```
- **401**: No autorizado: Token no proporcionado o inválido.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 401,
    "message": "No autorizado: Token no proporcionado o inválido."
  }
  ```

### DELETE /delete

**Descripción:** Elimina el perfil del usuario autenticado (borrado lógico).

**Parámetros:**

**Cuerpo de la Solicitud (Request Body):**

**Respuestas:**

- **200**: Usuario eliminado exitosamente. `Content-Type: application/json`
  ```json
  {
    "message": "Usuario eliminado exitosamente."
  }
  ```
- **401**: No autorizado: Token no proporcionado o inválido.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 401,
    "message": "No autorizado: Token no proporcionado o inválido."
  }
  ```
- **403**: Prohibido: El usuario no tiene permisos para realizar esta acción.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 403,
    "message": "Prohibido: El usuario no tiene permisos para realizar esta acción."
  }
  ```

### POST /send-email-verification

**Descripción:** Envía un correo electrónico de verificación al usuario
autenticado.

**Parámetros:**

**Cuerpo de la Solicitud (Request Body):**

**Respuestas:**

- **200**: Correo de verificación enviado exitosamente.
  `Content-Type: application/json`
  ```json
  {
    "message": "Correo de verificación enviado exitosamente."
  }
  ```
- **401**: No autorizado: Token no proporcionado o inválido.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 401,
    "message": "No autorizado: Token no proporcionado o inválido."
  }
  ```
- **409**: El usuario ya ha verificado su correo electrónico.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 409,
    "message": "El usuario ya ha verificado su correo electrónico."
  }
  ```

### GET /verify-email

**Descripción:** Verifica el correo electrónico del usuario utilizando un token
de verificación.

**Parámetros:**

- `token` (query, string, requerido): Token de verificación de correo
  electrónico.

**Cuerpo de la Solicitud (Request Body):**

**Respuestas:**

- **200**: Correo electrónico verificado exitosamente.
  `Content-Type: application/json`
  ```json
  {
    "message": "Correo electrónico verificado exitosamente."
  }
  ```
- **401**: No autorizado: Token no proporcionado o inválido.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 401,
    "message": "No autorizado: Token no proporcionado o inválido."
  }
  ```
- **400**: Token de verificación inválido o expirado.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "message": "Token de verificación inválido o expirado."
  }
  ```

### PUT /update-profile

**Descripción:** Actualiza el perfil del usuario autenticado. Permite actualizar
información personal y de contacto. Puede incluir la subida de archivos.

**Parámetros:**

**Cuerpo de la Solicitud (Request Body):** `Content-Type: multipart/form-data`

```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "dni": "87654321",
  "institute": "Nueva Universidad",
  "phone_number": "5544332211",
  "birth_date": "1992-05-15",
  "user_name": "janedoe",
  "profile_picture": "(archivo de imagen)"
}
```

**Respuestas:**

- **200**: Perfil del usuario actualizado exitosamente.
  `Content-Type: application/json`
  ```json
  {
    "message": "Perfil actualizado exitosamente.",
    "user": {
      "id": "uuid-del-usuario",
      "user_name": "janedoe",
      "email": "john.doe@example.com",
      "verified": true,
      "people": {
        "id": "uuid-de-people",
        "first_name": "Jane",
        "last_name": "Doe",
        "dni": "87654321",
        "institute": "Nueva Universidad",
        "phone_number": "5544332211",
        "birth_date": "1992-05-15T00:00:00.000Z"
      },
      "role": {
        "id": "uuid-del-rol",
        "name": "student"
      },
      "userFiles": [
        {
          "id": "uuid-del-archivo",
          "url": "https://cloudinary.com/image/profile.jpg",
          "file_name": "profile.jpg",
          "file_type": "image/jpeg"
        }
      ]
    }
  }
  ```
- **401**: No autorizado: Token no proporcionado o inválido.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 401,
    "message": "No autorizado: Token no proporcionado o inválido."
  }
  ```
- **400**: Error de validación o nombre de usuario ya en uso.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "message": "El nombre de usuario ya está en uso."
  }
  ```
