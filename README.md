# Documentación de Rutas API

Este documento detalla las rutas API disponibles en el sistema, organizadas por
módulos para facilitar la comprensión y el uso.

## Módulo de Autenticación (auth.route.ts)

- **POST** `/register`: Registro de un nuevo usuario.
- **POST** `/login`: Inicio de sesión de un usuario.
- **GET** `/seed-roles`: Sembrar roles en la base de datos.
- **GET** `/verify-token`: Verificar el token de autenticación.
- **POST** `/logout`: Cerrar sesión de un usuario.
- **GET** `/profile`: Obtener el perfil del usuario autenticado.
- **DELETE** `/delete`: Eliminar el perfil del usuario autenticado.
- **POST** `/send-email-verification`: Enviar correo de verificación.
- **GET** `/verify-email`: Verificar el correo electrónico del usuario.
- **PUT** `/update-profile`: Actualizar el perfil del usuario autenticado.

## Módulo de Comentarios (comment.route.ts)

- **POST** `/`: Crear un nuevo comentario.
- **GET** `/`: Leer todos los comentarios.
- **GET** `/:commentId`: Leer un comentario específico por ID.
- **PUT** `/:commentId`: Actualizar un comentario específico por ID.
- **DELETE** `/:commentId`: Eliminar un comentario específico por ID.

## Módulo de Clases/Cursos (class.route.ts)

- **POST** `/`: Crear una nueva clase/curso.
- **POST** `/join`: Unirse a una clase/curso.
- **POST** `/:classId/leave`: Salir de una clase/curso.
- **GET** `/user`: Obtener las clases/cursos a las que pertenece un usuario.
- **GET** `/:classId/user`: Obtener los usuarios de una clase/curso.
- **PUT** `/:classId`: Actualizar una clase/curso específica por ID.
- **DELETE** `/:classId`: Eliminar una clase/curso específica por ID.
- **USE** `/:classId/task`: Rutas de tareas anidadas.
- **USE** `/:classId/post`: Rutas de publicaciones anidadas.

## Módulo de Cursos (course.route.ts)

- **POST** `/`: Crear un nuevo curso.
- **POST** `/join`: Unirse a un curso.
- **POST** `/:classId/leave`: Salir de un curso.
- **GET** `/user`: Obtener los cursos a los que pertenece un usuario.
- **GET** `/:classId/user`: Obtener los usuarios de un curso.
- **PUT** `/:classId`: Actualizar un curso específico por ID.
- **DELETE** `/:classId`: Eliminar un curso específico por ID.
- **USE** `/:classId/task`: Rutas de tareas anidadas.
- **USE** `/:classId/post`: Rutas de publicaciones anidadas.

## Módulo de Publicaciones (post.route.ts)

- **POST** `/`: Crear una nueva publicación.
- **GET** `/`: Leer todas las publicaciones.
- **GET** `/:postId`: Leer una publicación específica por ID.
- **PUT** `/:postId`: Actualizar una publicación específica por ID.
- **DELETE** `/:postId`: Eliminar una publicación específica por ID.
- **USE** `/:postId/comment`: Rutas de comentarios anidadas.

## Módulo de Tareas (task.route.ts)

- **POST** `/`: Crear una nueva tarea.
- **PUT** `/:taskId`: Actualizar una tarea específica por ID.
- **DELETE** `/:taskId`: Eliminar una tarea específica por ID.
- **GET** `/`: Obtener todas las tareas de una clase.
- **GET** `/:taskId`: Obtener una tarea específica por ID.

## Módulo de Herramientas (tool.route.ts)

- **POST** `/extract-text-from-img`: Extraer texto de una imagen.
