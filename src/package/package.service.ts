import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { PackageDocument } from './entities/package.entity';
import { GetAllPackages } from './types/interfaces/getAllPackages';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PackageService {
  constructor(
    @InjectModel('Package')
    private packageModel: Model<PackageDocument>,
    private orderService: OrdersService,
  ) {}
  async getAllPackages(): Promise<GetAllPackages[]> {
    return this.packageModel.find({}).select('-createdAt -updatedAt');
  }

  async createPackage(userId: ObjectId, packageId: string): Promise<void> {
    const validId = ObjectId.isValid(packageId);
    if (!validId) throw new BadRequestException('invalid Id');
    const findPackage = await this.packageModel.findById(packageId);
    if (!findPackage) throw new NotFoundException('Package not found');
    await this.orderService.createOrder(userId, findPackage._id);
  }

  async getPackages(userId: ObjectId): Promise<object> {
    return await this.orderService.getPackagesByOrders(userId);
  }
}
