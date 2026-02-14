import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { MessageModule } from './modules/message/message.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';


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
    PrismaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
