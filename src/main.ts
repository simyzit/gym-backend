import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(morgan('tiny'));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4000, () =>
    console.log(`Database connected successful, server started on port 4000`),
  );
}
bootstrap();
