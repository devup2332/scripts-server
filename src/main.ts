import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environments } from './config/environments';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'log'],
  });
  await app.listen(environments.PORT);
}
bootstrap();
