import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  NotContains,
} from 'class-validator';

import regexpUser from '../regexp';

export class UpdateProfileDto {
  @IsString()
  @Matches(regexpUser.nameRegexp)
  @IsOptional()
  @IsNotEmpty()
  @NotContains(' ', { message: 'name should not contain a spaces' })
  name: boolean;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @NotContains(' ', { message: 'surname should not contain a spaces' })
  @Matches(regexpUser.surnameRegexp, {
    message: 'surname must be surname format',
  })
  surname: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @NotContains(' ', { message: 'email should not contain a spaces' })
  @Matches(regexpUser.emailRegexp, { message: 'email must be in email format' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @MinLength(5)
  phone: string;
}
