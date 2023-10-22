import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PackageSchema } from './entities/package.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Package', schema: PackageSchema }]),
  ],
  controllers: [PackageController],
  providers: [PackageService],
})
export class PackageModule {}
