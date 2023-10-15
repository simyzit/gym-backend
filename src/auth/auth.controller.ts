import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Res,
  Param,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Auth } from './guards/jwt.guard';
import { CurrentUser } from '../user/decorators/user.decorator';
import { UserDocument } from 'src/user/entities/user.entity';
import { RefreshDto } from './dto/refresh.dto';
import { AuthGoogle } from './guards/google.guard';
import { Response } from 'express';
import { AuthFacebook } from './guards/facebook.guard';
import { VerifyDto } from 'src/auth/dto/verify.dto';
import { RegisterUser } from './types/interfaces/register.user';
import { Message } from './types/interfaces/message';
import { Token } from '../token/types/interfaces/tokens';
import { LoginUser } from './types/interfaces/login.user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() body: RegisterDto): Promise<RegisterUser> {
    return await this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto): Promise<LoginUser> {
    return await this.authService.login(body);
  }

  @AuthGoogle()
  @Get('google/login')
  googleLogin(): void {}

  @AuthFacebook()
  @Get('facebook/login')
  facebookLogin(): void {}

  @AuthGoogle()
  @Get('google/redirect')
  async googleRedirect(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const {
      user: { address },
      ...newObj
    } = await this.authService.loginSocialNetwork(user);
    response.cookie('user', newObj).redirect(address);
  }

  @AuthFacebook()
  @Get('facebook/redirect')
  async facebookRedirect(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const {
      user: { address },
      ...newObj
    } = await this.authService.loginSocialNetwork(user);
    response.cookie('user', newObj).redirect(address);
  }

  @Patch('forgot/password/:email')
  async forgotPassword(@Param('email') email: string): Promise<Message> {
    await this.authService.forgotPassword(email);
    return { message: 'password changed successfully' };
  }

  @Get('verify/email/:verificationToken')
  async verifyEmail(
    @Param('verificationToken') verificationToken: string,
  ): Promise<Message> {
    await this.authService.verifyEmail(verificationToken);
    return { message: 'Verification successful' };
  }

  @Post('verify')
  async verifyAgain(@Body() body: VerifyDto): Promise<Message> {
    const { email } = body;
    await this.authService.verifyAgain(email);
    return { message: 'Verification email sent' };
  }

  @Get('logout')
  @HttpCode(204)
  @Auth()
  async logout(
    @CurrentUser('_id') _id: Pick<UserDocument, '_id'>,
  ): Promise<void> {
    await this.authService.logout(_id);
  }

  @Post('refresh')
  @HttpCode(200)
  async refreshToken(@Body() body: RefreshDto): Promise<Token> {
    return await this.authService.refreshToken(body.refreshToken);
  }

  @Get('cron')
  @HttpCode(201)
  async send(): Promise<Message> {
    return { message: 'ok' };
  }
}
