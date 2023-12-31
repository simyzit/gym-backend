import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './mail/mail.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModule } from './token/token.module';
import { PackageModule } from './package/package.module';
import { OrdersModule } from './orders/orders.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { QrCodeModule } from './qr-code/qr-code.module';
import { VisitModule } from './visit/visit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    EmailModule,
    TokenModule,
    PackageModule,
    OrdersModule,
    CloudinaryModule,
    QrCodeModule,
    VisitModule,
  ],
  providers: [],
})
export class AppModule {}
