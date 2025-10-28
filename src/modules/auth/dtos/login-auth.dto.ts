import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  @IsEmail({}, { message: 'El email es obligatorio y debe ser válido' })
  email: string;

  @IsString()
  @MinLength(8, {
    message: 'La contraseña es obligatoria y debe tener al menos 8 caracteres',
  })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_?*$])/, {
    message:
      'La contraseña debe tener al menos una mayúscula, una minúscula, un número y un caracter especial(-_?*$)',
  })
  password: string;
}
