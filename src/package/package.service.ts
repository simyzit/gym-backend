import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PackageDocument } from './entities/package.entity';
import { GetAllPackages } from './types/interfaces/getAllPackages';

@Injectable()
export class PackageService {
  constructor(
    @InjectModel('Package')
    private packageModel: Model<PackageDocument>,
  ) {}
  async getAllPackages(): Promise<GetAllPackages[]> {
    return this.packageModel.find({}).select('-createdAt -updatedAt');
  }
}
