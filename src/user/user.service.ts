import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { Profile } from 'passport';
import { v4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private emailService: EmailService,
  ) {}

  async createUser(
    body: Pick<User, 'email' | 'password' | 'name'>,
    password: string,
    verificationToken: string,
    avatarURL: string,
  ): Promise<UserDocument> {
    return await this.userModel.create({
      ...body,
      password,
      verificationToken,
      avatarURL,
    });
  }

  async addUserSocialNetwork(profile: Profile) {
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

  async findUserByToken(refreshToken: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ refreshToken });
  }

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }

  async findUserById(
    id: Pick<UserDocument, '_id'>,
  ): Promise<UserDocument | null> {
    return await this.userModel.findById(id);
  }
}
