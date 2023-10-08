import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerOptions } from '@nestjs-modules/mailer';
import { join } from 'path';

export const getMailConfig = async (
  configService: ConfigService,
): Promise<MailerOptions> => ({
  transport: {
    service: 'gmail',
    auth: {
      user: configService.get('mailUser'),
      pass: configService.get('mailPass'),
    },
  },
  defaults: {
    from: `Application Gym <${configService.get('mailFrom')}>`,
  },
  template: {
    dir: join(__dirname, '../email', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
});
