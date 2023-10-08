import { IsNotEmpty, Length, Matches } from 'class-validator';

export class VerifyDto {
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,80}$/)
  @Length(2, 80)
  email: string;
}
