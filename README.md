# Leximate: Aula Virtual Inclusiva para Estudiantes con Dislexia

## Problema

La dislexia no es solo un desafío individual para el estudiante que la padece,
sino una problemática que involucra a todo el entorno educativo. No solo afecta
el rendimiento académico, sino también la autoestima y las relaciones sociales.
Profesores, compañeros de clase y padres juegan un rol crucial en cómo se vive y
afronta la dislexia dentro del aula.

El reto es crear un espacio donde los estudiantes con dislexia puedan aprender
en igualdad de condiciones, donde los profesores cuenten con las herramientas
necesarias para adaptar su enseñanza y los compañeros de clase se eduquen en
empatía y comprensión. Este entorno debe promover el éxito académico, el
bienestar emocional y la inclusión social.

## Solución Propuesta: Leximate

Leximate es una plataforma virtual diseñada para proporcionar un entorno
inclusivo en el que los estudiantes con dislexia puedan aprender de forma
equitativa, y donde profesores y compañeros puedan colaborar activamente para
apoyar su progreso.

## Componentes Principales

1. **Aula Virtual**:

   - Espacio donde los profesores pueden crear clases, asignar tareas y evaluar
     el progreso de los estudiantes.
   - Se incluye la opción de adaptar las instrucciones y explicaciones para
     facilitar la comprensión de estudiantes con dislexia.

2. **Juegos Interactivos**:

   - Actividades lúdicas que ayudan a mejorar la comprensión lectora y
     habilidades cognitivas de los estudiantes con dislexia.
   - Los compañeros de clase también pueden participar en los juegos,
     promoviendo la colaboración y el desarrollo de la empatía.

3. **Herramientas de Apoyo Personalizado**:

   - Los estudiantes con dislexia tendrán acceso a herramientas como lectores de
     texto en voz alta y opciones para ajustar el tamaño y tipo de letra,
     colores de fondo, y más.
   - Ejercicios específicos diseñados para mejorar la ortografía, lectura y
     escritura, ajustados a las necesidades de cada estudiante.

4. **Seguimiento y Reportes Personalizados**:

   - Los profesores tendrán acceso a reportes detallados del progreso de los
     estudiantes, permitiendo realizar ajustes a las estrategias de enseñanza.
   - Además, los padres pueden recibir informes periódicos para colaborar con
     los avances de sus hijos desde casa.

5. **Foro de Apoyo**:
   - Espacio donde los estudiantes pueden compartir sus experiencias de forma
     anónima, hacer preguntas y comentar sobre los juegos y actividades
     interactivas.
   - Este foro fomenta un sentido de comunidad y ayuda a los estudiantes a
     sentirse comprendidos y apoyados.

## Funcionalidades

- Juegos interactivos orientados a mejorar la comprensión lectora de personas
  con dislexia.
- Gestión de clases y tareas para profesores y alumnos.

## Tecnologías

- Node.js
- Express
- Sequelize
- MySQL
- Doppler SDK
- Cloudinary
- Resend
- Zod
- JsonWebToken
- bcryptjs

## Requisitos

- Node.js: Utiliza [fnm](https://github.com/Schniz/fnm) para gestionar versiones
  de Node.js.
- MySQL instalado en tu máquina.
- Doppler SDK: Para gestionar variables de entorno de forma segura.

## Instalacion

- Clona el repositorio:

  ```bash
  git clone https://github.com/tu_usuario/leximate.git
  cd leximate
  ```

- Descarga las dependencias del proyecto:

```bash
npm install
```

- Descarga las variables de entorno del proyecto:

```bash
npm run pull-keys
```

- Inicializar servidor del proyecto:

```bash
npm run dev
```
