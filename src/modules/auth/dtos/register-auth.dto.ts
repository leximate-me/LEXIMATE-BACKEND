import {
  IsString,
  IsEmail,
  MinLength,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  dni: string;

  @IsString()
  institute: string;

  @IsString()
  phone_number: string;

  @IsDateString()
  birth_date: string;

  @IsString()
  user_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  role: string;
}
