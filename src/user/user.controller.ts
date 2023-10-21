import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from './decorators/user.decorator';
import { UserDocument } from './entities/user.entity';
import { Current } from './types/interfaces/current.user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
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
