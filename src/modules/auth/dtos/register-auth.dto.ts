import {
  IsString,
  IsEmail,
  MinLength,
  Matches,
  IsDateString,
} from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  @MinLength(3, {
    message: 'El nombre es obligatorio y debe tener al menos 3 caracteres',
  })
  first_name: string;

  @IsString()
  @MinLength(3, {
    message: 'El apellido es obligatorio y debe tener al menos 3 caracteres',
  })
  last_name: string;

  @IsString()
  @MinLength(7, {
    message: 'El DNI es obligatorio y debe tener al menos 7 caracteres',
  })
  dni: string;

  @IsString()
  @MinLength(3, {
    message: 'El instituto es obligatorio y debe tener al menos 3 caracteres',
  })
  institute: string;

  @IsString()
  @MinLength(10, { message: 'El número de teléfono es obligatorio' })
  phone_number: string;

  @IsDateString({}, { message: 'La fecha de nacimiento es obligatoria' })
  birth_date: string;

  @IsString()
  @MinLength(4, {
    message:
      'El nombre de usuario es obligatorio  y debe tener al menos 4 caracteres',
  })
  user_name: string;

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
