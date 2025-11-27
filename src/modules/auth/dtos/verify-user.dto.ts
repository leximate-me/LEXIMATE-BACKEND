import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { RoleEnum } from '@common/enums/role.enum';

export class VerifyUserDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(RoleEnum)
  @IsNotEmpty()
  roleName: RoleEnum;
}
