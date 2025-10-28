// middlewares.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { EnvConfiguration } from '../configs/env.config';
import { Application } from 'express';
import { errorHandler } from './error.middleware';

const applyMiddlewares = (app: Application) => {
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: EnvConfiguration().frontendUrl,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'X-Requested-With',
      ],
    })
  );
  app.use(morgan('dev'));
  app.use(errorHandler);
};

export { applyMiddlewares };
