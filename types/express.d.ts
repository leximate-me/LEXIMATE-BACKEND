import { TokenPayload } from '../src/middlewares/validator.token.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: TokenPayload;
  }
}
