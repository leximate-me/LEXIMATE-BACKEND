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
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

//routes
app.use('/api/auth', authRouter);
app.use('/api/task', taskRouter);

export { app };
