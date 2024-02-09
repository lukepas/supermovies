import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

type ServerConfig = {
  port: string;
  serverEnvironment: string;
};

async function bootstrap() {
  const serverConfig = config.get('server') as ServerConfig;

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
}

bootstrap();
