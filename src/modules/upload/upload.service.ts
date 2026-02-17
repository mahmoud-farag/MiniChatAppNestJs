import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { generateUploadUrl, getSignedImageUrl } from 'src/common/utilities/s3.util';

@Injectable()
export class UploadService {

  async getPresignedUploadUrl({fileName, folder, contentType}: {fileName: string, folder: string, contentType: string}, {expiresIn}: {expiresIn?: number}): Promise<{ uploadUrl: string, key: string }> {
   
    const key = `${folder}/${uuidv4()}-${fileName}`;
   
    const uploadUrl = await generateUploadUrl({fileName, folder, contentType}, { expiresIn });
  
    return { uploadUrl, key };
  }
 
  async getPresignedReadUrl({ fileName, folder }: { fileName: string, folder: string }, { expiresIn }: { expiresIn?: number }): Promise<{ signedUrl: string }> {
   
    const signedUrl = await getSignedImageUrl({ fileName, folder }, { expiresIn });
    return { signedUrl };
  }
}
