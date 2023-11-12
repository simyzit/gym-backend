import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

import { HydratedDocument } from 'mongoose';

export type VisitDocument = HydratedDocument<Visit>;

@Schema({ versionKey: false, timestamps: true })
export class Visit {
  @Prop({ type: ObjectId, ref: 'User' })
  userId: ObjectId;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
