import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PackageSchema } from './entities/package.entity';
// import { OrderSchema } from '../orders/entities/order.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Package', schema: PackageSchema }]),
    OrdersModule,
    UserModule,
  ],
  controllers: [PackageController],
  providers: [PackageService],
})
export class PackageModule {}
