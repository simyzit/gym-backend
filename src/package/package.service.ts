import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Package, PackageDocument } from './entities/package.entity';
import { GetAllPackages } from './types/interfaces/getAllPackages';
import { OrdersService } from '../orders/orders.service';
import { PackageDto } from './dto/package.dto';
import { AddPackageDto } from './dto/addPackageDto';
import { validateIdMongo } from 'src/helpers/validateIdMongo';
import { UserService } from 'src/user/user.service';
import { UserDocument } from 'src/user/entities/user.entity';

@Injectable()
export class PackageService {
  constructor(
    @InjectModel('Package')
    private packageModel: Model<PackageDocument>,
    private orderService: OrdersService,
    private userService: UserService,
  ) {}
  async getAllPackages(): Promise<GetAllPackages[]> {
    return this.packageModel.find({}).select('-createdAt -updatedAt');
  }

  async buyPackage(userId: string, packageId: string): Promise<void> {
    if (!validateIdMongo(packageId)) {
      throw new BadRequestException('invalid Id');
    }
    const findPackage = await this.findPackageById(packageId);
    if (!findPackage) throw new NotFoundException('Package not found');
    await this.orderService.createOrder(userId, findPackage._id);
    await this.userService.incrementDays(userId, findPackage.days);
  }

  async getPackages(user: UserDocument): Promise<Package[]> {
    return await this.orderService.getPackagesByOrders(user);
  }

  async addPackage(body: AddPackageDto): Promise<Package> {
    return await this.packageModel.create(body);
  }

  async deletePackage(id: string): Promise<Package> {
    if (!validateIdMongo(id)) {
      throw new BadRequestException('invalid Id');
    }
    const data = await this.packageModel.findByIdAndRemove(id).select('_id');
    if (!data) throw new NotFoundException('Package not found!');
    return data;
  }

  async updatePackage(id: string, body: PackageDto): Promise<Package> {
    if (!validateIdMongo(id)) {
      throw new BadRequestException('invalid Id');
    }
    const findPackage = await this.packageModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!findPackage) throw new NotFoundException('Package not found');

    return findPackage;
  }

  async findPackageById(id: string): Promise<PackageDocument | null> {
    return this.packageModel.findById(id);
  }
}
