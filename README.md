# LEXIMATE-BACKEND

Este proyecto es el backend de LEXIMATE, una aplicación que gestiona tareas,
cursos, usuarios, posts y comentarios. Está construido con Node.js y TypeScript,
utilizando Fastify como framework web y TypeORM para la interacción con la base
de datos PostgreSQL.

## Requisitos Previos

Antes de ejecutar este proyecto, asegúrate de tener instalado lo siguiente:

- **Node.js**: Versión 18 o superior. Puedes descargarlo desde
  [nodejs.org](https://nodejs.org/).
- **npm** o **Yarn**: Gestores de paquetes para Node.js. npm viene incluido con
  Node.js. Para Yarn, visita [yarnpkg.com](https://yarnpkg.com/).
- **Docker** y **Docker Compose**: Para levantar la base de datos PostgreSQL.
  Puedes descargarlos desde [docker.com](https://www.docker.com/).
- **TypeScript**: Para la compilación del código. Se instalará como dependencia
  de desarrollo.
- **PostgreSQL**: Aunque se recomienda usar Docker para la base de datos, si
  prefieres una instalación local, asegúrate de tener PostgreSQL instalado y
  configurado.

## Instalación

Sigue estos pasos para configurar y ejecutar el proyecto localmente:

1.  **Clonar el repositorio**:

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd LEXIMATE-BACKEND
    ```

2.  **Instalar dependencias**: Utiliza npm o Yarn para instalar las dependencias
    del proyecto:

    ```bash
    npm install
    # o
    yarn install
    ```

3.  **Configuración de Variables de Entorno**: Crea un archivo `.env` en la raíz
    del proyecto. Puedes usar el archivo `.env.example` (si existe) como
    plantilla. Las variables de entorno esenciales incluyen:
    - `PORT`: Puerto en el que se ejecutará el servidor (ej. `3000`).
    - `DATABASE_URL`: URL de conexión a la base de datos PostgreSQL (ej.
      `postgresql://user:password@localhost:5432/database_name`).
    - `JWT_SECRET`: Clave secreta para la firma de tokens JWT.
    - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`:
      Credenciales para Cloudinary (si se usa para almacenamiento de archivos).
    - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`,
      `AWS_BUCKET_NAME`: Credenciales para AWS S3 (si se usa para almacenamiento
      de archivos).
    - `RESEND_API_KEY`: Clave API para Resend (si se usa para envío de correos
      electrónicos).
    - Otras variables específicas de tu entorno.

    Ejemplo de `.env`:

    ```
    PORT=3000
    DATABASE_URL="postgresql://user:password@localhost:5432/leximate_db"
    JWT_SECRET="supersecretkey"
    CLOUDINARY_CLOUD_NAME="your_cloud_name"
    CLOUDINARY_API_KEY="your_api_key"
    CLOUDINARY_API_SECRET="your_api_secret"
    # AWS_ACCESS_KEY_ID="your_aws_access_key"
    # AWS_SECRET_ACCESS_KEY="your_aws_secret_access_key"
    # AWS_REGION="us-east-1"
    # AWS_BUCKET_NAME="your_aws_bucket_name"
    RESEND_API_KEY="re_your_resend_api_key"
    ```

4.  **Levantar la Base de Datos (con Docker Compose)**: Si estás utilizando
    Docker Compose para PostgreSQL, ejecuta:

    ```bash
    docker-compose up -d
    ```

    Esto iniciará un contenedor de PostgreSQL en segundo plano. Asegúrate de que
    tu `DATABASE_URL` en el archivo `.env` apunte a este contenedor (ej.
    `postgresql://user:password@localhost:5432/leximate_db`).

5.  **Ejecutar Migraciones de Base de Datos**: Una vez que la base de datos esté
    en funcionamiento, ejecuta las migraciones para crear el esquema de la base
    de datos:
    ```bash
    npm run typeorm migration:run
    # o
    yarn typeorm migration:run
    ```

## Ejecución del Proyecto

### Modo Desarrollo

Para iniciar el servidor en modo desarrollo (con recarga automática):

```bash
npm run dev
# o
yarn dev
```

El servidor estará disponible en `http://localhost:PORT` (donde `PORT` es el
puerto configurado en tu archivo `.env`).

### Modo Producción

Para compilar y ejecutar el proyecto en modo producción:

1.  **Compilar el código TypeScript**:

    ```bash
    npm run build
    # o
    yarn build
    ```

2.  **Iniciar el servidor**:
    ```bash
    npm run start
    # o
    yarn start
    ```

## Estructura del Proyecto

El proyecto sigue una estructura modular, organizada de la siguiente manera:

```
.
├── src/
│   ├── app.ts                  # Configuración principal de la aplicación Fastify
│   ├── index.ts                # Punto de entrada de la aplicación
│   ├── common/                 # Módulos comunes (adaptadores, configuraciones, middlewares, tipos)
│   │   ├── adapters/
│   │   ├── configs/
│   │   ├── enums/
│   │   ├── interfaces/
│   │   ├── libs/
│   │   └── middlewares/
│   ├── database/               # Configuración de la base de datos y TypeORM
│   │   └── db.ts
│   └── modules/                # Módulos de la aplicación (auth, comment, course, post, seed, task, tool, user)
│       ├── auth/
│       ├── comment/
│       ├── course/
│       ├── post/
│       ├── seed/
│       ├── task/
│       ├── tool/
│       └── user/
├── .dockerignore
├── .gitignore
├── docker-compose.yaml         # Configuración de Docker Compose para servicios
├── nodemon.json                # Configuración de Nodemon para desarrollo
├── package.json                # Metadatos del proyecto y dependencias
├── tsconfig.json               # Configuración de TypeScript
└── README.md                   # Este archivo
```

## Dependencias Clave

Aquí se listan algunas de las dependencias más importantes utilizadas en el
proyecto:

- **Fastify**: Framework web rápido y de bajo overhead.
- **TypeORM**: ORM para TypeScript y JavaScript que soporta PostgreSQL.
- **pg**: Cliente de PostgreSQL para Node.js.
- **bcryptjs**: Para el hashing de contraseñas.
- **jsonwebtoken**: Para la creación y verificación de tokens JWT.
- **dotenv** y **env-var**: Para la gestión de variables de entorno.
- **pino**: Logger de alto rendimiento.
- **cloudinary**, **aws-sdk**, **multer**: Para la carga y gestión de archivos.
- **pdf-parse**, **tesseract.js**: Para el procesamiento de documentos.
- **resend**: Para el envío de correos electrónicos.
- **zod**: Para la validación de esquemas.

## Scripts Disponibles

- `npm install` / `yarn install`: Instala todas las dependencias.
- `npm run build` / `yarn build`: Compila el código TypeScript a JavaScript.
- `npm run dev` / `yarn dev`: Inicia el servidor en modo desarrollo con
  `nodemon`.
- `npm run start` / `yarn start`: Inicia el servidor compilado en modo
  producción.
- `npm run typeorm <comando>` / `yarn typeorm <comando>`: Ejecuta comandos de
  TypeORM (ej. `migration:run`, `migration:generate`).

---
