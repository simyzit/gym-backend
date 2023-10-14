import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import * as argon2 from 'argon2';

import { Role } from '../types/enum/role';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    default: null,
  })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  avatarURL: string;

  @Prop({ default: null })
  accessToken: string;

  @Prop({ default: null })
  refreshToken: string;

  @Prop({ default: false })
  verify: boolean;

  @Prop({ default: null })
  verificationToken: string;

  @Prop({ enum: Role, default: Role.USER })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  try {
    const hashedPassword = await argon2.hash(this.password);

    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});
