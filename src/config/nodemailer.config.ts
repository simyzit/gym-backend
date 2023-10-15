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
    dir: join(__dirname, '../mail', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
});

// console.log((Math.floor(Math.random() * 9000000) + 1000000).toString());

//For prod
// transport: {
//   service: 'gmail',
//   auth: {
//     user: configService.get('mailUser'),
//     pass: configService.get('mailPass'),
//   },
// },

//For test

// transport: {
//   host: 'sandbox.smtp.mailtrap.io',
//   auth: {
//     user: '8ab2b3e10e0871',
//     pass: '253ecba9204742',
//   },
// },
