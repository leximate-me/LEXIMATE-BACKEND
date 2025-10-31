import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { FastifyRequest, FastifyReply } from 'fastify';
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
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.body) {
      throw HttpError.badRequest('No se recibió body en la petición.');
    }
    const dto: object = plainToInstance(DtoClass, request.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw HttpError.badRequest({
        message: 'Validation failed',
        validation: extractValidationFields(errors),
      });
    }
    (request.body as any) = dto;
  };
}
