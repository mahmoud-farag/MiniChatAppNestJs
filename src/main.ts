import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor, ResponseWrapperInterceptor } from './common/interceptors';
import { AllExceptionsFilter } from './common/errors';
import { InternalServerErrorException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  //*Global Interceptors
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new ResponseWrapperInterceptor());


  //* Global exception Filters
  app.useGlobalFilters(new AllExceptionsFilter());



  const frontUrl = process.env.FRONT_URL;

  if (!frontUrl)
    throw new InternalServerErrorException('FRONT_URL is not defined');


  app.enableCors({
    origin: [frontUrl],
    methods: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
