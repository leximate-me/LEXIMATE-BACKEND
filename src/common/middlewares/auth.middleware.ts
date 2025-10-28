import { Request, Response, NextFunction } from 'express';

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.rol;
    if (!userRole || !roles.includes(userRole)) {
      return res
        .status(403)
        .json({ error: 'No tienes permisos para acceder a esta ruta.' });
    }
    next();
  };
}
