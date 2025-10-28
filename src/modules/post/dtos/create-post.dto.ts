import { IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'El título es obligatorio y debe ser texto' })
  @MinLength(1, {
    message: 'El título es obligatorio y debe tener al menos 1 caracter',
  })
  title: string;

  @IsString({ message: 'El contenido es obligatorio y debe ser texto' })
  @MinLength(2, {
    message: 'El contenido es obligatorio y debe tener al menos 2 caracteres',
  })
  content: string;
}
