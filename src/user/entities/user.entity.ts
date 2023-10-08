import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import * as argon2 from 'argon2';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true, minlength: 2 })
  name: string;

  @Prop({
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,80}$/,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  accessToken: string;

  @Prop({ default: null })
  refreshToken: string;

  @Prop({ required: false })
  verificationToken: string;

  @Prop({ default: false })
  verify: boolean;
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
