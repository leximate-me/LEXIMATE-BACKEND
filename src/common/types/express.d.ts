import { TokenPayload } from '../interfaces/token-payload.interface';

declare module 'express-serve-static-core' {
  interface Request {
    user?: TokenPayload;
    file?: Express.Multer.File & {
      // Añade campos opcionales directamente
      cloudinaryUrl?: string;
      cloudinaryPublicId?: string;
    };
  }
}
