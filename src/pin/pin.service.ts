import { Model } from 'mongoose';
import { Pin, PinDocument } from './entities/pin.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from 'src/user/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PinService {
  constructor(@InjectModel('Pin') private pinModel: Model<PinDocument>) {}

  async createPin(body: Omit<Pin, 'userId'>, user: UserDocument) {
    return await this.pinModel.create({ ...body, userId: user._id });
  }

  async deletePin(id: string) {
    const data = await this.pinModel.findByIdAndRemove(id);
    if (!data) {
      throw new NotFoundException();
    }
    return data;
  }

  async getPins(user: UserDocument) {
    return await this.pinModel.find({ userId: user._id });
  }
}
