import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UserModule, MessageModule, AuthModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
