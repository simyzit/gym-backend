import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { EmailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from '../config/jwt.config';
import { GoogleStrategy } from './strategy/google.strategy';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { TokenService } from '../token/token.service';
import { QrCodeModule } from 'src/qr-code/qr-code.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
    UserModule,
    EmailModule,
    QrCodeModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    TokenService,
    GoogleStrategy,
    FacebookStrategy,
  ],
})
export class AuthModule {}
