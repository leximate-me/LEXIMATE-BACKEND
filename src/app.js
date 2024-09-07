import express from 'express';
import { authRouter } from './routes/auth.routes.js';
import { taskRouter } from './routes/tasks.routes.js';
import { applyMiddlewares } from './middlewares/app.middlewares.js';

//init app
const app = express();

//middlewares
applyMiddlewares(app);

//routes
app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);

export { app };
