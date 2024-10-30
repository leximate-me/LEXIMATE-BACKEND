import express from 'express';
import { applyMiddlewares } from './middlewares/app.middlewares';
import { userAuthRouter } from './routes/userAuth.routes';
import { userClassRouter } from './routes/userClass.routes';
import { userToolsRouter } from './routes/userTools.routes';
import { userPostRouter } from './routes/userPost.routes';

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
