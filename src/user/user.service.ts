import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Profile } from 'passport';
import { v4 } from 'uuid';
import { RegisterUser } from 'src/auth/types/interfaces/register.user';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { RoleDto } from './dto/role.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { validateIdMongo } from 'src/helpers/validateIdMongo';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async createUser(
    body: RegisterDto,
    verificationToken: string,
    avatarURL: string,
  ): Promise<UserDocument> {
    return await this.userModel.create({
      ...body,
      password: body.password,
      verificationToken,
      avatarURL,
    });
  }

  async addUserSocialNetwork(profile: Profile): Promise<RegisterUser> {
    const password = v4();
    return await this.userModel.create({
      name: profile.name.givenName,
      surname: profile.name.familyName,
      email: profile.emails[0].value,
      avatarURL: profile.photos[0].value,
      password,
      verify: true,
    });
  }

  async getUsers(_id: string): Promise<User[]> {
    return await this.userModel
      .find({ _id: { $ne: _id } })
      .select('_id name surname email phone avatarURL role');
  }

  async updateUserRole(id: string, body: RoleDto): Promise<User> {
    if (!validateIdMongo(id)) {
      throw new BadRequestException('invalid Id');
    }
    const findUser = await this.userModel
      .findByIdAndUpdate(id, { role: body.role }, { new: true })
      .select('_id name surname email phone avatarURL role');
    if (!findUser) throw new NotFoundException('User not found');
    return findUser;
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

  async findUserByToken(refreshToken: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ refreshToken });
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    return await this.userModel.findById(id);
  }
}
