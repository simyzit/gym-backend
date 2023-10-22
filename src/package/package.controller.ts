import { Controller, Get } from '@nestjs/common';
import { PackageService } from './package.service';
import { GetAllPackages } from './types/interfaces/getAllPackages';

@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get('all')
  async getAllPackages(): Promise<GetAllPackages[]> {
    return await this.packageService.getAllPackages();
  }
}
