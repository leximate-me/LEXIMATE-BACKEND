// middlewares.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { FRONTEND_URL } from '../configs/envConfig.js';

const applyMiddlewares = (app) => {
  app.use(express.json());
  app.use(
    cors({
      credentials: true,
      origin: FRONTEND_URL,
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
};

export { applyMiddlewares };
