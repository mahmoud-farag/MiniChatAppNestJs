import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor, ResponseWrapperInterceptor } from './common/interceptors';
import { AllExceptionsFilter } from './common/errors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  //*Global Interceptors
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new ResponseWrapperInterceptor());


  //* Global exception Filters
  app.useGlobalFilters(new AllExceptionsFilter());



  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
