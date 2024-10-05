// middlewares.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import Cookies from 'cookies';
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
  app.use((req, res, next) => {
    req.cookies = new Cookies(req, res);
    next();
  });
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: './uploads/',
    })
  );
};

export { applyMiddlewares };
