import { Injectable } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}
  async sendEmailConfirmation(param: {
    name: string;
    email: string;
    verificationToken: string;
  }): Promise<void> {
    const { name, email, verificationToken } = param;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation-email',
      context: {
        address: this.configService.get('ServerPath'),
        name,
        verificationToken,
      },
    });
  }

  async emailForgotPassword(
    email: string,
    name: string,
    password: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Forgot password',
      template: './forgot-password',
      context: {
        name,
        password,
      },
    });
  }
}
