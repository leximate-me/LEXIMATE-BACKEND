import express from 'express';
import { applyMiddlewares } from './middlewares/app.middlewares.js';
import { userAuthRouter } from './routes/userAuth.routes.js';
import { userClassRouter } from './routes/userClass.routes.js';
import { userTaskRouter } from './routes/userTask.routes.js';
import { userToolsRouter } from './routes/userTools.routes.js';

//init app
const app = express();

//middlewares
applyMiddlewares(app);

//routes
app.use('/api/auth', userAuthRouter);
app.use('/api/class', userClassRouter);
app.use('/api/task', userTaskRouter);
app.use('/api/tool', userToolsRouter);

export { app };
