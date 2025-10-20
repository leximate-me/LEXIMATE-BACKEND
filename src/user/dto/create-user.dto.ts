import {
  IsArray,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role as RoleEnum } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @IsOptional()
  @IsEnum(RoleEnum)
  role: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  @MinLength(8)
  dni: string;

  @IsString()
  institute: string;

  @IsString()
  user_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  phone_number: string;

  @IsDateString()
  birth_date: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede exceder 50 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial',
  })
  password: string;
}
