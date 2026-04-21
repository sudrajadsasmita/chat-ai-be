import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logger/logger.interceptor';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';
import { useContainer } from 'class-validator';
import * as os from 'os';

function getServerIPAddress(): string | undefined {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Chat AI Service API')
    .setDescription('API documentation for the CHAT AI Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const options: SwaggerCustomOptions = {
    raw: ['json', 'yaml'],
    jsonDocumentUrl: '/api/documentation/json',
    yamlDocumentUrl: '/api/documentation/yaml',
    customSiteTitle: 'CHAT AI Service API Documentation',
  };

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/documentation', app, documentFactory, options);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.use(helmet());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const port = process.env.PORT ?? 3000;
  const ip = getServerIPAddress();
  await app.listen(port, '0.0.0.0');
  process.env.TZ = 'Asia/Jakarta';
  console.log(
    `🚀 Server running on ${
      process.env.APP_MODE === 'production'
        ? `http://${ip}:${port}`
        : `http://localhost:${port}`
    }`,
  );
}
bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});
