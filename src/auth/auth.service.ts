/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import * as gravatar from 'gravatar';
import { MailService } from '../mail/mail.service';
import { v4 } from 'uuid';
import { UserDocument } from 'src/user/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../token/token.service';
import { RegisterUser } from './types/interfaces/register.user';
import { Token } from '../token/types/interfaces/tokens';
import { LoginUser } from './types/interfaces/login.user';
import { RegisterDto } from './dto/register.dto';
import { QrCodeService } from 'src/qr-code/qr-code.service';
import { Profile } from 'passport';
import { ObjectId } from 'mongodb';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
    private configService: ConfigService,
    private tokenService: TokenService,
    private qrCodeService: QrCodeService,
  ) {}
  async register(body: RegisterDto): Promise<RegisterUser> {
    const { email, name } = body;
    const findUser = await this.userService.findUser({ email });

    if (findUser) {
      throw new ConflictException('Email address is already registered');
    }
    const verificationToken = v4();
    const avatarURL = gravatar.url(email, { d: 'mp' });
    const data = await this.userService.createUser(
      body,
      verificationToken,
      avatarURL,
    );

    await this.qrCodeService.createQrCode(data._id);
    await this.mailService.sendEmailConfirmation({
      name,
      email,
      verificationToken,
    });
    return {
      name: data.name,
      email: data.email,
      verificationToken: data.verificationToken,
    };
  }

  async login(body: LoginDto): Promise<LoginUser> {
    const { email, password } = body;
    const findUser = await this.userService.findUser({ email });

    if (!findUser) throw new NotFoundException(`User not found`);
    const passCompare = await argon2.verify(findUser.password, password);

    if (!passCompare || !findUser.verify) {
      throw new UnauthorizedException(
        `Email is wrong or not verify, or password is wrong`,
      );
    }

    const tokens = await this.tokenService.generateTokens(findUser._id);
    const qrCode = await this.qrCodeService.findQrCode(findUser._id);
    await this.userService.findByIdAndUpdateUser(findUser._id, tokens);

    return {
      ...tokens,
      user: {
        email: findUser.email,
        name: findUser.name,
        surname: findUser.surname,
        avatarURL: findUser.avatarURL,
        role: findUser.role,
        days: findUser.days,
        qrCode: qrCode.imageURL,
      },
    };
  }

  async logout(_id: ObjectId): Promise<void> {
    await this.userService.findByIdAndUpdateUser(_id, {
      accessToken: null,
      refreshToken: null,
    });
  }

  async registerUserSocialNetwork(profile: Profile): Promise<RegisterUser> {
    const password = v4();
    const avatarURL = profile.photos[0].value;
    const user = {
      name: profile.name.givenName,
      surname: profile.name.familyName,
      email: profile.emails[0].value,
      password,
      verify: true,
    };
    const data = await this.userService.createUser(user, null, avatarURL);
    await this.qrCodeService.createQrCode(data._id);
    return data;
  }

  async loginSocialNetwork(user: UserDocument): Promise<LoginUser> {
    const tokens = await this.tokenService.generateTokens(user._id);
    const qrCode = await this.qrCodeService.findQrCode(user._id);
    await this.userService.findByIdAndUpdateUser(user._id, tokens);

    return {
      ...tokens,
      user: {
        email: user.email,
        name: user.name,
        surname: user.surname,
        avatarURL: user.avatarURL,
        role: user.role,
        days: user.days,
        qrCode: qrCode.imageURL,
      },
    };
  }

  async verifyEmail(verificationToken: string): Promise<void> {
    const findUser = await this.userService.findUser({ verificationToken });

    if (!findUser) throw new NotFoundException();
    await this.userService.findByIdAndUpdateUser(findUser._id, {
      verificationToken: null,
      verify: true,
    });
  }

  async verifyAgain(email: string): Promise<void> {
    const findUser = await this.userService.findUser({ email });

    if (!findUser) throw new NotFoundException('User not found');

    if (findUser.verify) {
      throw new BadRequestException('Verification has already been passed');
    }

    await this.mailService.sendEmailConfirmation({
      name: findUser.name,
      email: findUser.email,
      verificationToken: findUser.verificationToken,
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const findUser = await this.userService.findUser({ email });
    if (!findUser) throw new NotFoundException();
    const newPassword = v4();
    const hashPassword = await argon2.hash(newPassword);
    await this.userService.findByIdAndUpdateUser(findUser._id, {
      password: hashPassword,
    });
    await this.mailService.emailForgotPassword(
      findUser.email,
      findUser.name,
      newPassword,
    );
  }

  async refreshToken(token: string): Promise<Token> {
    const valid = await this.tokenService.validToken(
      token,
      this.configService.get('refreshSecretKey'),
    );
    const data = await this.userService.findUser({ refreshToken: token });
    if (!valid || !data) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const tokens = await this.tokenService.generateTokens(data._id);

    await this.userService.findByIdAndUpdateUser(data._id, tokens);

    return tokens;
  }
}
