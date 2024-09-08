import express from 'express';
import { teacherAuthRouter } from '../src/routes/teacherAuth.routes.js';
import { studentAuthRouter } from '../src/routes/studentAuth.routes.js';
import { taskRouter } from './routes/task.routes.js';
import { classRouter } from './routes/class.routes.js';
import { applyMiddlewares } from './middlewares/app.middlewares.js';

//init app
const app = express();

//middlewares
applyMiddlewares(app);

//routes
app.use('/api/teacher/auth', teacherAuthRouter);
app.use('/api/student/auth', studentAuthRouter);
app.use('/api/class', classRouter);
app.use('/api/class/:classId/tasks', taskRouter);

export { app };
