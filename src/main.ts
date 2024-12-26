import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { UnauthorizedExceptionFilter } from './comman/filters/unauthorized-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips properties not defined in the DTO
      forbidNonWhitelisted: true, // Throws an error if any non-whitelisted property is found
    }),
  );
  app.enableCors();
  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  await app.listen(4000,'0.0.0.0');
}
bootstrap();
