import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { OrderDocument } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(@InjectModel('Order') private orderModel: Model<OrderDocument>) {}

  async createOrder(userId: ObjectId, packageId: ObjectId): Promise<void> {
    await this.orderModel.create({ userId, packageId });
  }

  async getPackagesByOrders(userId: ObjectId): Promise<object> {
    return this.orderModel.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $lookup: {
          from: 'packages',
          localField: 'packageId',
          foreignField: '_id',
          as: 'packages',
        },
      },
      {
        $unwind: '$packages',
      },
      {
        $project: {
          _id: '$packages._id',
          name: '$packages.name',
          description: '$packages.description',
        },
      },
    ]);
  }
}
