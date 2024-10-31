import express from 'express';
import { applyMiddlewares } from './middlewares/app.middleware';
import { userAuthRouter } from './routes/userAuth.route';
import { userClassRouter } from './routes/userClass.route';
import { userToolsRouter } from './routes/userTools.route';
import { userPostRouter } from './routes/userPost.route';

//init app
const app = express();

//middlewares
applyMiddlewares(app);

//routes
app.use('/api/auth', userAuthRouter);
app.use('/api/class', userClassRouter);
app.use('/api/tool', userToolsRouter);
app.use('/api/post', userPostRouter);

export { app };
