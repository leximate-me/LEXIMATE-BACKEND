import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../libs/http-error';

function extractValidationFields(
  errors: ValidationError[]
): Array<{ field: string; errors: string[] }> {
  const result: Array<{ field: string; errors: string[] }> = [];
  for (const error of errors) {
    if (error.constraints) {
      result.push({
        field: error.property,
        errors: Object.values(error.constraints),
      });
    }
    if (error.children && error.children.length > 0) {
      result.push(...extractValidationFields(error.children));
    }
  }
  return result;
}

export function validateDto(DtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(DtoClass, req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      const fields = extractValidationFields(errors);
      return next(HttpError.badRequest(fields));
    }
    req.body = dto;
    next();
  };
}
