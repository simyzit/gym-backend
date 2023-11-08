import { Controller, Get, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Order } from './entities/order.entity';

import { UserDocument } from 'src/user/entities/user.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getOrders(@CurrentUser() user: UserDocument): Promise<Order[]> {
    return await this.ordersService.getOrders(user);
  }
}
