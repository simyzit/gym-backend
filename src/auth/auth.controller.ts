// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Controller, Get, Post, Body, HttpCode, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Auth } from './guards/jwt.guard';
import { CurrentUser } from './decorators/user.decorator';
import { UserDocument } from 'src/user/entities/user.entity';
import { RefreshDto } from './dto/refresh.dto';
import { AuthGoogle } from './guards/google.guard';
import { Response } from 'express';
import { AuthFacebook } from './guards/facebook.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() body: RegisterDto) {
    const { name, email, verificationToken } =
      await this.authService.register(body);
    return { name, email, verificationToken };
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @AuthGoogle()
  @Get('google/login')
  googleLogin() {}

  @AuthFacebook()
  @Get('facebook/login')
  facebookLogin() {}

  @AuthGoogle()
  @Get('google/redirect')
  async googleRedirect(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.userAuthentication(user);
    response
      .cookie('user', {
        name: data.name,
        email: data.email,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })
      .redirect(data.address);
  }

  @AuthFacebook()
  @Get('facebook/redirect')
  async facebookRedirect(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.userAuthentication(user);
    response
      .cookie('user', {
        name: data.name,
        email: data.email,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })
      .redirect(data.address);
  }

  @Get('logout')
  @HttpCode(204)
  @Auth()
  async logout(@CurrentUser('_id') _id: Pick<UserDocument, '_id'>) {
    await this.authService.logout(_id);
    return {};
  }

  @Post('refresh')
  @HttpCode(200)
  async refreshToken(@Body() body: RefreshDto) {
    return await this.authService.refreshToken(body.refreshToken);
  }

  @Get('cron')
  @HttpCode(201)
  async send() {
    return { message: 'ok' };
  }
}
