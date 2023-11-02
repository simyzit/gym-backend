import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
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
import { Message } from 'src/auth/types/interfaces/message';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/')
  async getUsers(): Promise<User[]> {
    return await this.userService.getUsers();
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
  async deleteUser(@Param('id') id: string): Promise<Message> {
    await this.userService.deleteUser(id);
    return { message: 'User deleted' };
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
