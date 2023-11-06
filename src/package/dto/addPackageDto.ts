import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddPackageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  description: string[];

  @IsNumber()
  @IsNotEmpty()
  days: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
