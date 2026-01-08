// Pastikan ini adalah baris PERTAMA
import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Increase body limit to 10MB
  app.use(json({ limit: '10mb' }));

  app.setGlobalPrefix('api');

  app.enableCors({ origin: '*' });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    exceptionFactory: (errors) => {
      const result = errors.map((error) => ({
        property: error.property,
        message: error.constraints ? Object.values(error.constraints)[0] : 'Invalid value',
      }));
      return new BadRequestException(result);
    },
  }));

  const config = new DocumentBuilder()
    .setTitle('Gereja Digital API')
    .setDescription('Dokumentasi API untuk sistem manajemen gereja')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Gereja Digital API Docs',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
  console.log(`Swagger Docs available at: http://localhost:${port}/docs`);
}
bootstrap();