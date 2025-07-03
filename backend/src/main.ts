// @ts-ignore
import { graphqlUploadExpress } from 'graphql-upload';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuration CORS
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000','https://webfront-document-manager.onrender.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'Apollo-Require-Preflight',
      'apollo-require-preflight',
    ],
    credentials: true,
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Enable file upload middleware before body parsers
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  // Augmenter la limite de taille des requêtes
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Configuration des fichiers statiques
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000/graphql`);
}
bootstrap();
