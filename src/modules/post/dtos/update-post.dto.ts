import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString({ message: 'El título debe ser texto' })
  @MinLength(1, { message: 'El título debe tener al menos 1 caracter' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'El contenido debe ser texto' })
  @MinLength(2, { message: 'El contenido debe tener al menos 2 caracteres' })
  content?: string;
}
