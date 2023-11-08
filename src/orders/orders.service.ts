import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Order, OrderDocument } from './entities/order.entity';
import { UserDocument } from 'src/user/entities/user.entity';
import { filterByRole } from 'src/helpers/filterByRole';
import { Package } from 'src/package/entities/package.entity';

@Injectable()
export class OrdersService {
  constructor(@InjectModel('Order') private orderModel: Model<OrderDocument>) {}

  async createOrder(userId: string, packageId: ObjectId): Promise<void> {
    await this.orderModel.create({ userId, packageId });
  }

  async getPackagesByOrders(user: UserDocument): Promise<Package[]> {
    return this.orderModel.aggregate([
      {
        $match: filterByRole(user),
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

  async getOrders(user: UserDocument): Promise<Order[]> {
    return await this.orderModel.aggregate([
      {
        $match: filterByRole(user),
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'packages',
          localField: 'packageId',
          foreignField: '_id',
          as: 'package',
        },
      },
      {
        $project: {
          _id: 1,
          userName: { $arrayElemAt: ['$user.name', 0] },
          packageName: { $arrayElemAt: ['$package.name', 0] },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
  }
}
