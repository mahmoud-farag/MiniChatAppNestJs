import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

let s3ClientInstance: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }
  return s3ClientInstance;
}

function getBucketName(): string {
  const bucketName = process.env.S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('S3_BUCKET_NAME is not defined in environment variables');
  }
  return bucketName;
}

/**
 * Generates a pre-signed PUT URL for the client to upload a file directly to S3.
 */
export async function generateUploadUrl({ fileName, folder, contentType }: { fileName: string, folder: string, contentType: string }, { expiresIn = 3600 }: { expiresIn?: number }): Promise<{ uploadUrl: string }> {

  const key = generateS3Key(folder, fileName);
  const bucketName = getBucketName();

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(getS3Client(), command, { expiresIn });

  return { uploadUrl };
}



/**
 * Generates a pre-signed GET URL for reading/displaying an object from S3.
 */
export async function getSignedImageUrl({ fileName, folder }: { fileName: string, folder: string }, { expiresIn = 3600 }: { expiresIn?: number }): Promise<string> {

  const key = generateS3Key(folder, fileName);

  const command = new GetObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  });

  return getSignedUrl(getS3Client(), command, { expiresIn });
}


function generateS3Key(folder: string, fileName: string) {

  if (!fileName || !folder) {
    throw new Error('File name and folder are required');
  }

  const cleanFolder = folder.replace(/\/$/, '');
  const cleanFileName = fileName.replace(/^\//, '');

  return `${cleanFolder}/${cleanFileName}`;
};
