import { Controller, Param, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { VerifyDto } from './dto/verify.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('verify/email/:verificationToken')
  async verifyEmail(@Param('verificationToken') verificationToken: string) {
    await this.userService.verifyEmail(verificationToken);
    return { message: 'Verification successful' };
  }

  @Post('verify')
  async verifyAgain(@Body() body: VerifyDto) {
    const { email } = body;
    await this.userService.verifyAgain(email);
    return { message: 'Verification email sent' };
  }
}
