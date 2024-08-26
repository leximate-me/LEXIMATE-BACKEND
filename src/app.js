import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.routes.js';
import { taskRouter } from './routes/tasks.routes.js';

//init
const app = express();

//middlewares
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(cookieParser());

//routes
app.use('/api/auth', authRouter);
app.use('/api/task', taskRouter);

export { app };
