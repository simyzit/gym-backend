import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @Length(2, 80)
  @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,80}$/)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  @Matches(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[\?\.,!_\-~\$%\+=@#\^&])(?=.*?[0-9])\S{8,20}$/,
  )
  password: string;
}
