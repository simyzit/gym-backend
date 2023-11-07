import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryModule } from 'nestjs-cloudinary';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { getCloudinaryConfig } from 'src/config/cloudinary.config';

@Module({
  imports: [
    CloudinaryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getCloudinaryConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class NestCloudinaryClientModule {}
