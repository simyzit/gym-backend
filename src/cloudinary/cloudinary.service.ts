import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

import { CloudinaryService as Cloudinary } from 'nestjs-cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private cloudinary: Cloudinary) {}

  async uploadFile(
    file: any,
    folderName: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return await this.cloudinary.uploadFile(file, {
      folder: folderName,
    });
  }
}
