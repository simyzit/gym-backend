import { IsIn, IsString } from 'class-validator';

import { Role } from '../types/enum/role';

export class RoleDto {
  @IsString()
  @IsIn([Role.USER, Role.MANAGER, Role.ADMIN])
  role: boolean;
}
