import { IsString, MinLength } from 'class-validator';

export class CreateCourseDto {
  @IsString({ message: 'El nombre es obligatorio y debe ser texto' })
  @MinLength(1, {
    message: 'El nombre es obligatorio y debe tener al menos 1 caracter',
  })
  name: string;

  @IsString({ message: 'La descripción es obligatoria y debe ser texto' })
  @MinLength(2, {
    message: 'La descripción es obligatoria y debe tener al menos 2 caracteres',
  })
  description: string;
}
