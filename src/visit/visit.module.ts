import { Module } from '@nestjs/common';
import { VisitService } from './visit.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitSchema } from './entities/visit.entity';
import { VisitController } from './visit.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Visit', schema: VisitSchema }]),
    UserModule,
  ],
  providers: [VisitService],
  controllers: [VisitController],
})
export class VisitModule {}
