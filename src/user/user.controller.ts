import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from './decorators/user.decorator';
import { User } from './entities/user.entity';
import { Current } from './types/interfaces/current.user';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleDto } from './dto/role.dto';
import { validationOption } from 'src/helpers/validationOptions';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe(validationOption))
  async updateUserProfile(
    @CurrentUser('_id') _id: string,
    @Body() body: UpdateProfileDto,
  ): Promise<User> {
    return await this.userService.updateUserProfile(_id, body);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/')
  async getUsers(@CurrentUser('_id') _id: string): Promise<User[]> {
    return await this.userService.getUsers(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @CurrentUser('_id') _id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 3000000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<object> {
    return await this.userService.updateAvatar(_id, file);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe(validationOption))
  @Patch('/:id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() body: RoleDto,
  ): Promise<User> {
    return await this.userService.updateUserRole(id, body);
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return await this.userService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  async getCurrentUser(@CurrentUser() user: User): Promise<Current> {
    return {
      email: user.email,
      name: user.name,
      surname: user.surname,
      avatarURL: user.avatarURL,
      role: user.role,
    };
  }
}

//
