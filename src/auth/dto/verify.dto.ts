import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class VerifyDto {
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    { message: 'email must be in email format' },
  )
  email: string;
}
