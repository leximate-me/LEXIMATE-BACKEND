// middlewares.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { FRONTEND_URL, FRONTEND_URL_PROD } from '../configs/env.config';
import { Application } from 'express';

const allowedOrigins = [FRONTEND_URL, FRONTEND_URL_PROD];

const applyMiddlewares = (app: Application) => {
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      credentials: true,
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    })
  );
  app.use(morgan('dev'));
};

export { applyMiddlewares };
