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
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from './decorators/user.decorator';
import { User, UserDocument } from './entities/user.entity';
import { Current } from './types/interfaces/current.user';
import { Role } from './types/enum/role';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { validationOption } from 'src/helpers/validationOptions';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/updateUser.dto';
import { MongoExceptionFilter } from 'src/filters/mongo.exeption.filter';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/')
  async getUsers(@CurrentUser('_id') _id: string): Promise<User[]> {
    return await this.userService.getUsers(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  async getCurrentUser(@CurrentUser() user: UserDocument): Promise<Current> {
    const data = await this.userService.currentUser(user._id);
    return {
      email: user.email,
      name: user.name,
      surname: user.surname,
      phone: user.phone,
      avatarURL: user.avatarURL,
      role: user.role,
      days: user.days,
      qrCode: data.imageURL,
    };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe(validationOption))
  @UseFilters(MongoExceptionFilter)
  async updateUserProfile(
    @CurrentUser('_id') _id: string,
    @Body() body: UpdateProfileDto,
  ): Promise<User> {
    return await this.userService.updateUserProfile(_id, body);
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
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<object> {
    return await this.userService.updateAvatar(_id, file);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe(validationOption))
  @Patch('/:id')
  @UseFilters(MongoExceptionFilter)
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser(id, body);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return await this.userService.deleteUser(id);
  }
}
