import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UploadService } from './upload.service';
import { S3FoldersEnum } from 'src/common/enums';

@Controller('upload')
export class UploadController {

  constructor(private readonly uploadService: UploadService) { }

  @Post('presigned-url')
  async getPresignedUploadUrl(@Body() body: { fileName: string; contentType: string }) {

    const folder = S3FoldersEnum.AVATARS_IMAGES;

    const response = await this.uploadService.getPresignedUploadUrl({ fileName: body.fileName, folder, contentType: body.contentType }, { expiresIn: 60 * 60 });

    return { message: "Presigned URL generated successfully", data: response };
  }

  // @Get('signed-url/:key')
  // getSignedUrl( @Param('key') key: string, @Query('expiresIn') expiresIn?: string) {

  //   return this.uploadService.getPresignedReadUrl({key, expiresIn: expiresIn ? +expiresIn : undefined});

  // }
}
