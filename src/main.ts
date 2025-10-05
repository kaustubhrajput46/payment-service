import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation for security
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(3000);
  console.log('Payment Service is running on: http://localhost:3000');
  console.log('Security Testing Endpoints:');
  console.log('POST /payments - Create payment (tests SQL injection & XSS protection)');
  console.log('GET /payments/:id - Get payment (tests XSS protection)');
}
bootstrap();
