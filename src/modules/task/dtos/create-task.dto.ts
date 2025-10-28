import {
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  IsDateString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(4, {
    message: 'El nombre es obligatorio y debe tener al menos 4 caracteres',
  })
  title: string;

  @IsString()
  @MinLength(3, {
    message: 'La descripción es obligatoria y debe tener al menos 3 caracteres',
  })
  description: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsString()
  @IsDateString(
    {},
    {
      message:
        'La fecha de vencimiento es obligatoria y debe ser una fecha válida',
    }
  )
  due_date: string;
}
