import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { FastifyRequest, FastifyReply } from 'fastify';

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
    const dto: object = plainToInstance(DtoClass, request.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      const fields = extractValidationFields(errors);
      reply.code(400).send({ message: 'Validación fallida', fields });
      return;
    }
    // Sobrescribe el body con la instancia validada
    (request.body as any) = dto;
  };
}
