# Documentación de Rutas del Módulo de Seed

Este documento detalla las rutas disponibles en el módulo de Seed. Para cada
ruta, se proporciona una descripción, los parámetros esperados y ejemplos de
cuerpos de solicitud y respuesta en formato JSON.

---

## Rutas Principales del Módulo de Seed

### POST /seed

**Descripción:** Ejecuta el proceso de siembra de datos para inicializar la base
de datos con información de prueba.

**Parámetros:** Ninguno

**Cuerpo de la Solicitud (Request Body):** Ninguno

**Respuestas:**

- **200**: Datos sembrados exitosamente. `Content-Type: application/json`
  ```json
  {
    "message": "Datos sembrados exitosamente."
  }
  ```
- **500**: Error interno del servidor durante el proceso de siembra.
  `Content-Type: application/json`
  ```json
  {
    "statusCode": 500,
    "error": "Internal Server Error",
    "message": "Error al sembrar los datos."
  }
  ```
