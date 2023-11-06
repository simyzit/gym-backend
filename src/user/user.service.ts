import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Profile } from 'passport';
import { v4 } from 'uuid';
import { RegisterUser } from 'src/auth/types/interfaces/register.user';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { RoleDto } from './dto/role.dto';

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

  async getUsers(): Promise<User[]> {
    return await this.userModel
      .find({})
      .select('_id name surname email phone avatarURL role');
  }

  async updateUserRole(id: string, body: RoleDto): Promise<User> {
    const findUser = await this.findUserById(id);
    if (!findUser) throw new NotFoundException('User not found');
    return await this.userModel
      .findByIdAndUpdate(id, { role: body.role }, { new: true })
      .select('_id name surname email phone avatarURL role');
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndRemove(id).select('_id');
    if (!user) throw new NotFoundException('User not found!');
    return user;
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
