import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ObjectId } from 'mongodb';

import { HydratedDocument } from 'mongoose';

export type PinDocument = HydratedDocument<Pin>;

@Schema({ versionKey: false, timestamps: true })
export class Pin {
  @Prop({ required: true, min: 3, type: String })
  title: string;

  @Prop({ required: true, min: 3, type: String })
  desc: string;

  @Prop({ min: 0, max: 5 })
  rating: number;

  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  long: number;

  @Prop({ type: ObjectId, ref: 'User' })
  userId: ObjectId;
}

export const PinSchema = SchemaFactory.createForClass(Pin);
