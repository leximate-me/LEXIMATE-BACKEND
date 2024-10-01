import express from 'express';
import { applyMiddlewares } from './middlewares/app.middlewares.js';
import { userAuthRouter } from './routes/userAuth.routes.js';
import { userClassRouter } from './routes/userClass.routes.js';
import { userTaskRouter } from './routes/userTask.routes.js';

//init app
const app = express();

//middlewares
applyMiddlewares(app);

//routes
// app.use('/api/auth', authRouter);
app.use('/api/auth', userAuthRouter);
app.use('/api/class', userClassRouter);
app.use('/api/task', userTaskRouter);

export { app };
