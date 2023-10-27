import {
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  NotContains,
} from 'class-validator';

import regexpUser from '../../user/regexp';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @NotContains(' ', { message: 'email should not contain a spaces' })
  @Matches(regexpUser.emailRegexp, { message: 'email must be in email format' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
