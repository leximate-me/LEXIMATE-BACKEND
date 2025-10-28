import { IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'El contenido es obligatorio y debe ser texto' })
  @MinLength(1, {
    message: 'El contenido es obligatorio y debe tener al menos 1 caracter',
  })
  content: string;
}
