import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

export type PackageDocument = HydratedDocument<Package>;

@Schema({ versionKey: false, timestamps: true })
export class Package {
  @Prop({ type: String })
  name: string;

  @Prop({ type: [String] })
  description: string[];

  @Prop({
    type: Number,
  })
  days: number;

  @Prop({
    type: Number,
  })
  price: number;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
