import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UploadModule } from '../upload/upload.module';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [UploadModule, S3Module],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
