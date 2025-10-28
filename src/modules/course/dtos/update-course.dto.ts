import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(1, { message: 'El nombre debe tener al menos 1 caracter' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  @MinLength(2, { message: 'La descripción debe tener al menos 2 caracteres' })
  description?: string;
}
