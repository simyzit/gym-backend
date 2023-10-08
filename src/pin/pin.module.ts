import { Module } from '@nestjs/common';
import { PinService } from './pin.service';
import { PinController } from './pin.controller';
import { PinSchema } from './entities/pin.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Pin', schema: PinSchema }])],
  controllers: [PinController],
  providers: [PinService],
})
export class PinModule {}
