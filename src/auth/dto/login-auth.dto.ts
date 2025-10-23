import {
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

export class LoginAuthDto {
  // @IsString()
  // userName: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede exceder 50 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-_\-])[A-Za-z\d@$!%*?&_\-]+$/,
    {
      message:
        'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial',
    },
  )
  password: string;
}
