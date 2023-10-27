import { IsNotEmpty, IsString, Matches, NotContains } from 'class-validator';

import regexpUser from '../../user/regexp';

export class VerifyDto {
  @IsNotEmpty()
  @IsString()
  @NotContains(' ', {
    message: 'email should not contain a spaces',
  })
  @Matches(regexpUser.emailRegexp, { message: 'email must be in email format' })
  email: string;
}
