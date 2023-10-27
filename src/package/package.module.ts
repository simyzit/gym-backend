import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PackageSchema } from './entities/package.entity';
import { OrdersService } from '../orders/orders.service';
import { OrderSchema } from '../orders/entities/order.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Package', schema: PackageSchema },
      { name: 'Order', schema: OrderSchema },
    ]),
  ],
  controllers: [PackageController],
  providers: [PackageService, OrdersService],
})
export class PackageModule {}
