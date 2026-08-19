import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.use(helmet());

  app.enableCors({
    origin: (origin, callback) => {
      const allowed = config.get<string>('CORS_ORIGINS', '');

      if (!origin || allowed.split(',').includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  const port = Number(config.get<string>('PORT', '3000'));

  await app.listen(port);
  console.log(`HatodGo API listening on http://localhost:${port}/api`);
}

bootstrap();