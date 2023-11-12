import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryModule as Cloudinary } from 'nestjs-cloudinary';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { getCloudinaryConfig } from 'src/config/cloudinary.config';

@Module({
  imports: [
    Cloudinary.forRootAsync({
      imports: [ConfigModule],
      useFactory: getCloudinaryConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
