import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PackageService } from './package.service';
import { GetAllPackages } from './types/interfaces/getAllPackages';
import { Message } from 'src/auth/types/interfaces/message';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../user/decorators/user.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PackageDto } from './dto/package.dto';
import { validationOption } from 'src/helpers/validationOptions';
import { Package } from './entities/package.entity';
import { AddPackageDto } from './dto/addPackageDto';
import { Role } from 'src/user/types/enum/role';
import { UserDocument } from 'src/user/entities/user.entity';

@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get('all')
  async getAllPackages(): Promise<GetAllPackages[]> {
    return await this.packageService.getAllPackages();
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe(validationOption))
  @Post('/add')
  async addPackage(@Body() body: AddPackageDto): Promise<Package> {
    return await this.packageService.addPackage(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getPackages(@CurrentUser() user: UserDocument): Promise<Package[]> {
    return await this.packageService.getPackages(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  async buyPackage(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string,
  ): Promise<Message> {
    await this.packageService.buyPackage(userId, id);
    return { message: 'Package added successfully' };
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('/:id')
  async deletePackage(@Param('id') id: string): Promise<Package> {
    return await this.packageService.deletePackage(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @UsePipes(new ValidationPipe(validationOption))
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch('/:id')
  async updatePackage(
    @Param('id') id: string,
    @Body() body: PackageDto,
  ): Promise<Package> {
    return await this.packageService.updatePackage(id, body);
  }
}
