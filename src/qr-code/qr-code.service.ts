import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

import * as qrcode from 'qrcode';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { QrCodeDocument } from './entities/qr-code.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class QrCodeService {
  constructor(
    @InjectModel('Qr-codes') private qrCodeModel: Model<QrCodeDocument>,
    private cloudinary: CloudinaryService,
  ) {}

  async createQrCode(_id: ObjectId): Promise<void> {
    const link = `${process.env.SERVER_PROD}api/visit/${_id}`;
    const qr = await this.generateQrCode(link);
    const uploadQr = await this.uploadQrCode(qr);
    await this.qrCodeModel.create({ userId: _id, imageURL: uploadQr });
  }

  async generateQrCode(data: string): Promise<Buffer> {
    try {
      return await qrcode.toBuffer(data);
    } catch (error) {
      return null;
    }
  }

  async uploadQrCode(
    qrCodeDataURL: Buffer,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const upload = await this.cloudinary.uploadFile(
      { buffer: qrCodeDataURL },
      'qr-codes',
    );
    return upload.url;
  }

  async findQrCode(_id: ObjectId): Promise<QrCodeDocument | null> {
    return this.qrCodeModel.findOne({ userId: _id });
  }
}
