import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/modules/s3/s3.service';

@Injectable()
export class UploadService {

  constructor(private readonly s3Service: S3Service) { }



  async getPresignedUploadUrl({ fileName, folder, contentType }: { fileName: string, folder: string, contentType: string }, { expiresIn }: { expiresIn?: number }): Promise<{ uploadUrl: string }> {


    const { uploadUrl } = await this.s3Service.generateUploadUrl({ fileName, folder, contentType }, { expiresIn });

    return { uploadUrl };
  }

  async getPresignedReadUrl({ fileName, folder }: { fileName: string, folder: string }, { expiresIn }: { expiresIn?: number }): Promise<{ signedUrl: string }> {

    const signedUrl = await this.s3Service.getSignedImageUrl({ fileName, folder }, { expiresIn });
    return { signedUrl };
  }
}
