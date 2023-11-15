import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { validateIdMongo } from 'src/helpers/validateIdMongo';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RegisterSocial } from 'src/auth/types/interfaces/registerSocial.dto';
import { ObjectId } from 'mongodb';
import { QrCode } from 'src/qr-code/entities/qr-code.entity';
import { QrCodeService } from 'src/qr-code/qr-code.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private cloudinaryService: CloudinaryService,
    private qrCodeService: QrCodeService,
  ) {}

  async createUser(
    body: RegisterDto | RegisterSocial,
    verificationToken: string | null,
    avatarURL: string,
  ): Promise<UserDocument> {
    return await this.userModel.create({
      ...body,
      verificationToken,
      avatarURL,
    });
  }

  async getUsers(_id: string): Promise<User[]> {
    return await this.userModel
      .find({ _id: { $ne: _id } })
      .select('_id name surname email phone avatarURL role');
  }

  async updateUser(id: string, body: UpdateUserDto): Promise<User> {
    if (!validateIdMongo(id)) {
      throw new BadRequestException('invalid Id');
    }
    const findUser = await this.userModel
      .findByIdAndUpdate(id, body, { new: true })
      .select('_id name surname email phone avatarURL role');
    if (!findUser) throw new NotFoundException('User not found');
    return findUser;
  }

  async currentUser(id: ObjectId): Promise<QrCode> {
    return this.qrCodeService.findQrCode(id);
  }

  async deleteUser(id: string): Promise<User> {
    if (!validateIdMongo(id)) {
      throw new BadRequestException('invalid Id');
    }
    const user = await this.userModel.findByIdAndRemove(id).select('_id');
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  async updateUserProfile(id: string, body: UpdateProfileDto): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, body, { new: true })
      .select('name surname email phone');
  }

  async updateAvatar(
    id: string,
    file: Express.Multer.File,
  ): Promise<{ avatarURL: string }> {
    console.log(file);
    const avatar = await this.cloudinaryService.uploadFile(file, 'avatars');
    await this.userModel.findByIdAndUpdate(id, { avatarURL: avatar.url });
    return { avatarURL: avatar.url };
  }

  async incrementDays(id: string, days: number): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { $inc: { days: days } });
  }

  async decrementDays(id: ObjectId): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { $inc: { days: -1 } });
  }

  async findUser(obj: object): Promise<UserDocument | null> {
    return await this.userModel.findOne(obj);
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    return await this.userModel.findById(id);
  }

  async findByIdAndUpdateUser(_id: ObjectId, obj: object): Promise<void> {
    await this.userModel.findByIdAndUpdate(_id, obj);
  }
}
