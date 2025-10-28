import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../libs/http-error';

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.rol;
    if (!userRole || !roles.includes(userRole)) {
      return next(
        HttpError.forbidden('No tienes permisos para acceder a esta ruta.')
      );
    }
    next();
  };
}
