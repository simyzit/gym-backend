import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Res,
  Param,
  Patch,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { CurrentUser } from '../user/decorators/user.decorator';
import { UserDocument } from 'src/user/entities/user.entity';
import { RefreshDto } from './dto/refresh.dto';
import { GoogleAuthGuard } from './guards/google.guard';
import { Response } from 'express';
import { FacebookAuthGuard } from './guards/facebook.guard';
import { VerifyDto } from './dto/verify.dto';
import { RegisterUser } from './types/interfaces/register.user';
import { Message } from './types/interfaces/message';
import { Token } from '../token/types/interfaces/tokens';
import { LoginUser } from './types/interfaces/login.user';
import { validationOption } from 'src/helpers/validationOptions';
import { ObjectId } from 'mongodb';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe(validationOption))
  @Post('register')
  @HttpCode(201)
  async register(@Body() body: RegisterDto): Promise<RegisterUser> {
    return await this.authService.register(body);
  }

  @UsePipes(new ValidationPipe(validationOption))
  @Post('login')
  async login(@Body() body: LoginDto): Promise<LoginUser> {
    return await this.authService.login(body);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin(): void {}

  @UseGuards(FacebookAuthGuard)
  @Get('facebook/login')
  facebookLogin(): void {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  async googleRedirect(
    @CurrentUser() currentUser: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const data = await this.authService.loginSocialNetwork(currentUser);

    response.redirect(
      `${process.env.FRONTEND_DOMAIN_PROD}/?accessToken=${data.accessToken}&refreshToken=${data.refreshToken}&email=${data.user.email}&name=${data.user.name}&surname=${data.user.surname}&avatar=${data.user.avatarURL}&role=${data.user.role}&days=${data.user.days}&qrcode=${data.user.qrCode}`,
    );
  }

  @UseGuards(FacebookAuthGuard)
  @Get('facebook/redirect')
  async facebookRedirect(
    @CurrentUser() currentUser: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const data = await this.authService.loginSocialNetwork(currentUser);

    response.redirect(
      `${process.env.FRONTEND_DOMAIN_PROD}/?accessToken=${data.accessToken}&refreshToken=${data.refreshToken}&email=${data.user.email}&name=${data.user.name}&surname=${data.user.surname}&avatar=${data.user.avatarURL}&role=${data.user.role}&days=${data.user.days}&qrcode=${data.user.qrCode}`,
    );
  }

  @Patch('forgot/password/:email')
  async forgotPassword(@Param('email') email: string): Promise<Message> {
    await this.authService.forgotPassword(email);
    return { message: 'password changed successfully' };
  }

  @Get('verify/email/:verificationToken')
  async verifyEmail(
    @Res() response: Response,
    @Param('verificationToken') verificationToken: string,
  ): Promise<void> {
    await this.authService.verifyEmail(verificationToken);
    response.redirect(`${process.env.FRONTEND_DOMAIN_PROD}/success-verified`);
  }

  @UsePipes(new ValidationPipe(validationOption))
  @Post('verify')
  async verifyAgain(@Body() body: VerifyDto): Promise<Message> {
    const { email } = body;
    await this.authService.verifyAgain(email);
    return { message: 'Verification email sent' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @HttpCode(204)
  async logout(@CurrentUser('_id') _id: ObjectId): Promise<void> {
    await this.authService.logout(_id);
  }

  @UsePipes(new ValidationPipe(validationOption))
  @Post('refresh')
  @HttpCode(200)
  async refreshToken(@Body() body: RefreshDto): Promise<Token> {
    return await this.authService.refreshToken(body.refreshToken);
  }
}
