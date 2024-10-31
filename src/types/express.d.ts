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
  }
}

declare global {
  namespace Express {
    interface MulterFile extends Multer.File {
      cloudinaryUrl?: string;
      cloudinaryPublicId?: string;
    }

    interface Request {
      file?: MulterFile;
    }
  }
}
