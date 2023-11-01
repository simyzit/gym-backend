import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PackageService } from './package.service';
import { GetAllPackages } from './types/interfaces/getAllPackages';
import { Message } from 'src/auth/types/interfaces/message';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../user/decorators/user.decorator';
import { UserDocument } from 'src/user/entities/user.entity';
import { ObjectId } from 'mongodb';

@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get('all')
  async getAllPackages(): Promise<GetAllPackages[]> {
    return await this.packageService.getAllPackages();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  async createPackage(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ): Promise<Message> {
    await this.packageService.createPackage(user._id, id);
    return { message: 'Package added successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getPackages(@CurrentUser('_id') _id: ObjectId): Promise<object> {
    return await this.packageService.getPackages(_id);
  }
}
