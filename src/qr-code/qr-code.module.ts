import { Module } from '@nestjs/common';
import { QrCodeService } from './qr-code.service';

import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QrCodeSchema } from './entities/qr-code.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Qr-codes', schema: QrCodeSchema }]),
  ],
  providers: [QrCodeService, CloudinaryService],
  exports: [QrCodeService],
})
export class QrCodeModule {}
