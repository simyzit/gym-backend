import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  NotContains,
} from 'class-validator';

import regexpUser from '../regexp';
import { Role } from '../types/enum/role';

export class UpdateUserDto {
  @IsString()
  @Matches(regexpUser.nameRegexp)
  @IsOptional()
  @IsNotEmpty()
  @NotContains(' ', { message: 'name should not contain a spaces' })
  name: boolean;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @NotContains(' ', { message: 'surname should not contain a spaces' })
  @Matches(regexpUser.surnameRegexp, {
    message: 'surname must be surname format',
  })
  surname: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @MinLength(5)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @NotContains(' ', { message: 'email should not contain a spaces' })
  @Matches(regexpUser.emailRegexp, { message: 'email must be in email format' })
  email: string;

  @IsString()
  @IsOptional()
  @IsIn([Role.USER, Role.MANAGER, Role.ADMIN])
  role: boolean;
}
