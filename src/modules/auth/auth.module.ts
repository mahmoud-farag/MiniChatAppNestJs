import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.registerAsync({
      // imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {

        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('EXPIRES_IN'),
          }
        }
      },
      inject: [ConfigService]
    }),

    UserModule
  ],
  exports: [JwtModule],
})
export class AuthModule {}
