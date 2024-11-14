export interface TokenPayload {
  id: number;
  rol: number;
  verify: boolean;
  iat: number;
  exp: number;
}

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
