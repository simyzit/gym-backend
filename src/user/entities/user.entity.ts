import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import * as argon2 from 'argon2';

import { Role } from '../types/enum/role';

export type UserDocument = HydratedDocument<User>;

import regexpUser from '../regexp';

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  surname: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    match: regexpUser.emailRegexp,
  })
  email: string;

  @Prop({
    type: String,
    default: null,
    minlength: 5,
  })
  phone: string;

  @Prop({ type: String, required: true, minlength: 8 })
  password: string;

  @Prop({ type: String, required: true })
  avatarURL: string;

  @Prop({ type: String, default: null })
  accessToken: string;

  @Prop({ type: String, default: null })
  refreshToken: string;

  @Prop({ type: Boolean, default: false })
  verify: boolean;

  @Prop({ type: String, default: null })
  verificationToken: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: string;

  @Prop({ type: Number, default: 0 })
  days: number;
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
