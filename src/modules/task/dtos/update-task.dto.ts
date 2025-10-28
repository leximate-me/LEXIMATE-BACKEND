import { IsString, IsBoolean, MinLength, IsDateString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @MinLength(4, { message: 'El nombre debe tener al menos 4 caracteres' })
  title: string;

  @IsString()
  @MinLength(3, { message: 'La descripción debe tener al menos 3 caracteres' })
  description: string;

  @IsBoolean()
  status: boolean;

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
