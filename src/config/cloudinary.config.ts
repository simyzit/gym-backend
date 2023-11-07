import { ConfigService } from '@nestjs/config';
import { CloudinaryModuleOptions } from 'nestjs-cloudinary';

export const getCloudinaryConfig = async (
  ConfigService: ConfigService,
): Promise<CloudinaryModuleOptions> => ({
  isGlobal: true,
  cloud_name: ConfigService.get('cloudinaryName'),
  api_key: ConfigService.get('cloudinaryApiKey'),
  api_secret: ConfigService.get('cloudinaryApiSecret'),
});
