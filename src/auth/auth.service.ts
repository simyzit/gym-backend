/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import * as gravatar from 'gravatar';
import { EmailService } from 'src/email/email.service';
import { v4 } from 'uuid';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private userService: UserService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}
  async register(
    body: Pick<User, 'email' | 'password' | 'name'>,
  ): Promise<UserDocument> {
    const { email, password, name } = body;
    const findUser = await this.userService.findUserByEmail(email);

    if (findUser) {
      throw new ConflictException('Email address is already registered');
    }
    const verificationToken = v4();
    const avatarURL = gravatar.url(email, { d: 'mp' });
    const data = await this.userService.createUser(
      body,
      password,
      verificationToken,
      avatarURL,
    );
    await this.emailService.sendEmailConfirmation({
      name,
      email,
      verificationToken,
    });

    return data;
  }

  async login(body: Pick<User, 'email' | 'password'>) {
    const { email, password } = body;
    const findUser = await this.userService.findUserByEmail(email);

    if (!findUser) throw new NotFoundException(`User not found`);
    const passCompare = await argon2.verify(findUser.password, password);

    if (!passCompare || !findUser.verify) {
      throw new UnauthorizedException(
        `Email is wrong or not verify, or password is wrong`,
      );
    }

    const tokens = await this.generateTokens(findUser._id);

    await this.userModel.findByIdAndUpdate(findUser._id, tokens);

    return {
      ...tokens,
      user: {
        email: findUser.email,
        name: findUser.name,
        surname: findUser.surname,
        avatarURL: findUser.avatarURL,
        role: findUser.role,
      },
    };
  }

  async logout(_id: Pick<UserDocument, '_id'>): Promise<void> {
    await this.userModel.findByIdAndUpdate(_id, {
      accessToken: null,
      refreshToken: null,
    });
  }

  async userAuthentication(user: UserDocument) {
    const tokens = await this.generateTokens(user._id);

    await this.userModel.findByIdAndUpdate(user._id, tokens);

    return {
      ...tokens,
      user: {
        email: user.email,
        name: user.name,
        surname: user.surname,
        avatarURL: user.avatarURL,
        role: user.role,
        address: this.configService.get('ServerPath'),
      },
    };
  }

  async verifyEmail(verificationToken: string): Promise<void> {
    const findUser = await this.userModel.findOne({ verificationToken });

    if (!findUser) throw new NotFoundException();

    await this.userModel.findByIdAndUpdate(findUser._id, {
      verificationToken: null,
      verify: true,
    });
  }

  async verifyAgain(reqMail: string): Promise<void> {
    const findUser = await this.userService.findUserByEmail(reqMail);

    if (!findUser) throw new NotFoundException('User not found');

    const { verify, verificationToken, name, email } = findUser;

    if (verify) {
      throw new BadRequestException('Verification has already been passed');
    }

    await this.emailService.sendEmailConfirmation({
      name,
      email,
      verificationToken,
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const findUser = await this.userService.findUserByEmail(email);
    if (!findUser) throw new NotFoundException();
    const newPassword = v4();
    const hashPassword = await argon2.hash(newPassword);
    await this.userModel.findByIdAndUpdate(findUser._id, {
      password: hashPassword,
    });
    await this.emailService.emailForgotPassword(
      findUser.email,
      findUser.name,
      newPassword,
    );
  }

  async refreshToken(token: string) {
    const valid = await this.validToken(
      token,
      this.configService.get('refreshSecretKey'),
    );

    const data = await this.userService.findUserByToken(token);

    if (!valid || !data) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { accessToken, refreshToken } = await this.generateTokens(data._id);

    await this.userModel.findByIdAndUpdate(data._id, {
      accessToken,
      refreshToken,
    });

    return { accessToken, refreshToken };
  }

  async validToken(
    token: string,
    secret: string,
  ): Promise<{ id: string } | null> {
    try {
      const result = await this.jwtService.verifyAsync(token, {
        secret,
      });

      return result;
    } catch (error) {
      return null;
    }
  }

  async generateTokens(
    id: Pick<UserDocument, '_id'>,
  ): Promise<Pick<UserDocument, 'accessToken' | 'refreshToken'>> {
    const accessToken = await this.jwtService.signAsync({ id });
    const refreshToken = await this.jwtService.signAsync(
      { id },
      {
        secret: this.configService.get('refreshSecretKey'),
        expiresIn: this.configService.get('refreshTokenExpires'),
      },
    );
    return { accessToken, refreshToken };
  }
}
