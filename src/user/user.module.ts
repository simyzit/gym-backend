import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { QrCodeModule } from 'src/qr-code/qr-code.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    QrCodeModule,
  ],
  controllers: [UserController],
  providers: [UserService, CloudinaryService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
