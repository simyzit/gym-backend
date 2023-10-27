import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  process.env.NODE_ENV === 'development' && app.use(morgan('tiny'));
  await app.listen(4000, () =>
    console.log(`Database connected successful, server started on port 4000`),
  );
}
bootstrap();
