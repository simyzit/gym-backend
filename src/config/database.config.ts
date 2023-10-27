import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getDatabaseConfig = async (
  ConfigService: ConfigService,
): Promise<MongooseModuleOptions> => ({
  uri:
    process.env.NODE_ENV === 'test'
      ? ConfigService.get('mongoUrlTest')
      : ConfigService.get('mongoUrl'),
});
