import express from 'express';
import { teacherAuthRouter } from './routes/teacherAuth.routes.js';
import { taskRouter } from './routes/tasks.routes.js';
import { applyMiddlewares } from './middlewares/app.middlewares.js';

//init app
const app = express();

//middlewares
applyMiddlewares(app);

//routes
// app.use('/api/auth', authRouter);
app.use('/api/teacher/auth', teacherAuthRouter);
app.use('/api/tasks', taskRouter);

export { app };
