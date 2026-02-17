import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;

/**
 * Generates a pre-signed PUT URL for the client to upload a file directly to S3.
 */
export async function generateUploadUrl({ fileName, folder, contentType }: { fileName: string, folder: string, contentType: string }, { expiresIn = 3600 }: { expiresIn?: number }): Promise<string> {
  
  const key = generateS3Key(folder, fileName);
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}



/**
 * Generates a pre-signed GET URL for reading/displaying an object from S3.
 */
export async function getSignedImageUrl({ fileName, folder }: { fileName: string, folder: string }, { expiresIn = 3600 }: { expiresIn?: number }): Promise<string> {

  const key = generateS3Key(folder, fileName);

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}


function generateS3Key (folder: string, fileName: string) {

  if (!fileName || !folder) {
    throw new Error('File name and folder are required');
  }

  const cleanFolder = folder.replace(/\/$/, '');
  const cleanFileName = fileName.replace(/^\//, '');

  return `${cleanFolder}/${cleanFileName}`;
};


