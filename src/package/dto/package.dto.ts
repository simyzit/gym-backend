import { IsArray, IsNumber, IsString } from 'class-validator';

export class PackageDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  description: string[];

  @IsNumber()
  days: number;

  @IsNumber()
  price: number;
}
