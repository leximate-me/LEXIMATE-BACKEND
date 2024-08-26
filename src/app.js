import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
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
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads/',
  })
);

//routes
app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);

export { app };
