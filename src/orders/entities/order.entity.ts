import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ versionKey: false, timestamps: true })
export class Order {
  @Prop({ type: ObjectId, ref: 'User' })
  userId: ObjectId;

  @Prop({ type: ObjectId, ref: 'Package' })
  packageId: ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
