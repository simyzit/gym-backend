import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z]/, { message: 'name must be in name format' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z]/, { message: 'surname must be surname format' })
  surname: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    { message: 'email must be in email format' },
  )
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Phone must contain at least 5 numbers' })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
