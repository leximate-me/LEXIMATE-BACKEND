import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../libs/http-error';

export function validateDto(DtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (typeof DtoClass !== 'function') {
      return next(
        new HttpError(500, 'El DTO proporcionado no es una clase válida')
      );
    }
    const dto = plainToInstance(DtoClass, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      return next(new HttpError(400, 'Error de validación', errors));
    }
    req.body = dto;
    next();
  };
}
