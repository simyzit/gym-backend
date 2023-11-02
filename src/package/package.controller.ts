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
import { UserDocument } from 'src/user/entities/user.entity';
import { ObjectId } from 'mongodb';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PackageDto } from './dto/package.dto';
import { validationOption } from 'src/helpers/validationOptions';
import { Package } from './entities/package.entity';

@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get('all')
  async getAllPackages(): Promise<GetAllPackages[]> {
    return await this.packageService.getAllPackages();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getPackages(@CurrentUser('_id') _id: ObjectId): Promise<object> {
    return await this.packageService.getPackages(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  async buyPackage(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ): Promise<Message> {
    await this.packageService.buyPackage(user._id, id);
    return { message: 'Package added successfully' };
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('/:id')
  async deletePackage(@Param('id') id: string): Promise<Message> {
    await this.packageService.deletePackage(id);
    return { message: 'Package deleted' };
  }

  @Roles('admin')
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
