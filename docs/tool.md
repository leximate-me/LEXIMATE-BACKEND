# Documentación de Rutas del Módulo de Herramientas

Este documento detalla las rutas disponibles en el módulo de Herramientas. Para
cada ruta, se proporciona una descripción, los parámetros esperados y ejemplos
de cuerpos de solicitud y respuesta en formato JSON.

---

## Rutas Principales del Módulo de Herramientas

### POST /extract-text

**Descripción:** Extrae texto de un archivo de imagen proporcionado.

**Parámetros:** Ninguno

**Cuerpo de la Solicitud (Request Body):** `Content-Type: multipart/form-data`

```
// Se espera un archivo de imagen en el campo 'file'
```

**Respuestas:**

- **200**: Texto extraído exitosamente. `Content-Type: application/json`
  ```json
  {
    "text": "Este es el texto extraído de la imagen."
  }
  ```
- **400**: Error de validación o archivo no proporcionado.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": "No se ha proporcionado ningún archivo."
  }
  ```
- **500**: Error interno del servidor durante la extracción de texto.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 500,
    "error": "Internal Server Error",
    "message": "Error al extraer texto de la imagen."
  }
  ```

### POST /chatbot

**Descripción:** Envía un mensaje a un chatbot y recibe una respuesta.

**Parámetros:** Ninguno

**Cuerpo de la Solicitud (Request Body):** `Content-Type: application/json`

```json
{
  "message": "¿Cuál es la capital de Francia?"
}
```

**Respuestas:**

- **200**: Respuesta del chatbot recibida exitosamente.
  `Content-Type: application/json`
  ```json
  {
    "response": "La capital de Francia es París."
  }
  ```
- **400**: Error de validación en el mensaje proporcionado.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": "El mensaje es obligatorio."
  }
  ```
- **500**: Error interno del servidor al comunicarse con el chatbot.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 500,
    "error": "Internal Server Error",
    "message": "Error al obtener respuesta del chatbot."
  }
  ```

### GET /markdown-url

**Descripción:** Obtiene el contenido Markdown de una URL específica.

**Parámetros:**

- `url`: (query) (string) (requerido) La URL de la que se desea obtener el
  contenido Markdown.

**Cuerpo de la Solicitud (Request Body):** Ninguno

**Respuestas:**

- **200**: Contenido Markdown obtenido exitosamente.
  `Content-Type: application/json`
  ```json
  {
    "markdown": "# Título de la página\n\nEste es el contenido Markdown de la URL."
  }
  ```
- **400**: URL no proporcionada o inválida. `Content-Type: application/json`
  ```json
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": "La URL es obligatoria."
  }
  ```
- **404**: No se pudo encontrar contenido Markdown en la URL.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "No se pudo obtener el contenido Markdown de la URL."
  }
  ```
- **500**: Error interno del servidor al procesar la URL.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 500,
    "error": "Internal Server Error",
    "message": "Error al procesar la URL."
  }
  ```
