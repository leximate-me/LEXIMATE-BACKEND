import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString({ message: 'El contenido debe ser texto' })
  @MinLength(1, { message: 'El contenido debe tener al menos 1 caracter' })
  content?: string;
}
