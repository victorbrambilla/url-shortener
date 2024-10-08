import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupSwagger } from './utils/setup-swagger.util';
import { logger } from './utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger:logger('app')
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
