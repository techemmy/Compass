import 'dotenv/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';

// TODO: add status codes to controllers
// TODO: add return types to services
// TODO: move throwing errors to the controllers
// TODO: add IsMongooseIdpipe to controllers getting Id
// TODO: make response structure consistent
// TODO: limit file upload size

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://acrid-hour-snotty-hand-production.pipeops.app',
    ],
    credentials: true,
    allowedHeaders: '*',
  });
  app.setGlobalPrefix('/api');
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  // app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
