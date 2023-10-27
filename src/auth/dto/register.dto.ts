import {
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  NotContains,
} from 'class-validator';

import regexpUser from '../../user/regexp';

export class RegisterDto {
  @IsNotEmpty()
  @NotContains(' ', { message: 'name should not contain a spaces' })
  @IsString()
  @Matches(regexpUser.nameRegexp)
  name: string;

  @IsNotEmpty()
  @IsString()
  @NotContains(' ', { message: 'surname should not contain a spaces' })
  @Matches(regexpUser.surnameRegexp, {
    message: 'surname must be surname format',
  })
  surname: string;

  @IsNotEmpty()
  @IsString()
  @NotContains(' ', { message: 'email should not contain a spaces' })
  @Matches(regexpUser.emailRegexp, { message: 'email must be in email format' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
