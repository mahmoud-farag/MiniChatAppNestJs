import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './modules/user/user.module';
import { MessageModule } from './modules/message/message.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './common/guards';
import { UploadModule } from './modules/upload/upload.module';
import { S3Module } from './modules/s3/s3.module';
import { ChatGateway } from './chatGateway/chat.gateway';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    UserModule,
    MessageModule,
    AuthModule,
    PrismaModule,
    UploadModule,
    S3Module,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    ChatGateway,
  ],
})
export class AppModule { }
