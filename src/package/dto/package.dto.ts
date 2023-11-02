import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class PackageDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  description: string[];

  @IsNumber()
  @IsOptional()
  days: number;

  @IsNumber()
  @IsOptional()
  price: number;
}
