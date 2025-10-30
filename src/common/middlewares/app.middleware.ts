import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import { EnvConfiguration } from '../configs/env.config';

export async function applyMiddlewares(app: FastifyInstance) {
  await app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  await app.register(cookie);
  await app.register(multipart);
}
