import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

import { HydratedDocument } from 'mongoose';

export type QrCodeDocument = HydratedDocument<QrCode>;

@Schema({ versionKey: false, timestamps: true })
export class QrCode {
  @Prop({ type: ObjectId, ref: 'User' })
  userId: ObjectId;

  @Prop({ type: String })
  imageURL: string;
}

export const QrCodeSchema = SchemaFactory.createForClass(QrCode);
