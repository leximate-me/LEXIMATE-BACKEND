import { RoleEnum } from '@common/enums/role.enum';

export class VerifyUserDto {

  userIds: string[];

  roleName: RoleEnum;
}
