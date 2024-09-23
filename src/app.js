import express from 'express';
import { applyMiddlewares } from './middlewares/app.middlewares.js';
import { userAuthRouter } from './routes/userAuth.routes.js';

//init app
const app = express();

//middlewares
applyMiddlewares(app);

//routes
// app.use('/api/auth', authRouter);
app.use('/api/auth', userAuthRouter);

export { app };
