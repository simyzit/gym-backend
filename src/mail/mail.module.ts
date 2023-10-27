import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMailConfig } from '../config/nodemailer.config';

@Module({
  providers: [MailService],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMailConfig,
      inject: [ConfigService],
    }),
  ],
  exports: [MailService],
})
export class EmailModule {}
