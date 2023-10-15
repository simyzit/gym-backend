import { Module } from '@nestjs/common';
import { EmailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMailConfig } from 'src/config/nodemailer.config';

@Module({
  providers: [EmailService],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMailConfig,
      inject: [ConfigService],
    }),
  ],
  exports: [EmailService],
})
export class EmailModule {}
