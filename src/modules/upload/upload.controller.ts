import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UploadService } from './upload.service';
import { S3FoldersEnum } from 'src/common/enums';

@Controller('upload')
export class UploadController {

  constructor(private readonly uploadService: UploadService) {}

  @Post('presigned-url')
  getPresignedUploadUrl(
    @Body() body: { fileName: string; contentType: string },
  ) {
    
    const folder = S3FoldersEnum.AVATARS_IMAGES;

    return this.uploadService.getPresignedUploadUrl({fileName: body.fileName, folder, contentType: body.contentType}, { expiresIn: 60 * 60 });
  }

  // @Get('signed-url/:key')
  // getSignedUrl( @Param('key') key: string, @Query('expiresIn') expiresIn?: string) {

  //   return this.uploadService.getPresignedReadUrl({key, expiresIn: expiresIn ? +expiresIn : undefined});

  // }
}
