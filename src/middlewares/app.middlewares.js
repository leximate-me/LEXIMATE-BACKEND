// middlewares.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

const applyMiddlewares = (app) => {
  app.use(express.json());
  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:5173',
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
