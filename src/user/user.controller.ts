import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from './decorators/user.decorator';
import { User, UserDocument } from './entities/user.entity';
import { Current } from './types/interfaces/current.user';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/')
  async getUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  async getCurrentUser(@CurrentUser() user: UserDocument): Promise<Current> {
    return {
      email: user.email,
      name: user.name,
      surname: user.surname,
      avatarURL: user.avatarURL,
      role: user.role,
    };
  }
}
