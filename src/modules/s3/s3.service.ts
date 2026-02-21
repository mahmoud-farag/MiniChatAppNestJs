import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
    private readonly S3Client: S3Client | null = null;
    private readonly bucketName: string;

    constructor(private readonly configService: ConfigService) {

        this.bucketName = this.configService.get<string>('S3_BUCKET_NAME')!;

        this.S3Client = new S3Client({
            region: this.configService.get<string>('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!
            },
        });
    }



    //* Private Methods

    private generateS3Key(folder: string, fileName: string): string {

        if (!fileName || !folder)
            throw new BadRequestException('File name and folder are required');


        const cleanFolder = folder.replace(/\/$/, '');
        const cleanFileName = fileName.replace(/^\//, '');

        return `${cleanFolder}/${cleanFileName}`;
    };

    private getBucketName(): string {

        if (!this.bucketName) {
            throw new InternalServerErrorException('S3_BUCKET_NAME is not defined in environment variables');
        }

        return this.bucketName;
    }


    private getS3Client(): S3Client {

        if (!this.S3Client) {
            throw new InternalServerErrorException('S3 client is not initialized');
        }

        return this.S3Client
    }




    //* Public Methods

    async generateUploadUrl({ fileName, folder, contentType }: { fileName: string, folder: string, contentType: string }, { expiresIn = 3600 }: { expiresIn?: number }): Promise<{ uploadUrl: string }> {
        try {
            console.log('S3::generateUploadUrl started');

            const key = this.generateS3Key(folder, fileName);
            const bucketName = this.getBucketName();


            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: key,
                ContentType: contentType,
            });

            const uploadUrl = await getSignedUrl(this.getS3Client(), command, { expiresIn });

            return { uploadUrl };

        } catch (error) {
            console.log('error while generate the S3 uploading url', error);
            throw error
        }


    }


    async getSignedImageUrl({ fileName, folder }: { fileName: string, folder: string }, { expiresIn = 3600 }: { expiresIn?: number }): Promise<string> {
        try {
            console.log('S3::getSignedImageUrl started');

            const key = this.generateS3Key(folder, fileName);
            const command = new GetObjectCommand({
                Bucket: this.getBucketName(),
                Key: key,
            });

            const signedUrl = await getSignedUrl(this.getS3Client(), command, { expiresIn });

            return signedUrl;

        } catch (error) {
            console.log('error while generate the S3 reading url', error);
            throw error
        }

    }

    async deleteObject({ fileName, folder }: { fileName: string, folder: string }) {
        try {
            console.log('S3::deleteObject started');

            const key = this.generateS3Key(folder, fileName);

            const command = new DeleteObjectCommand({
                Bucket: this.getBucketName(),
                Key: key,
            });

            await this.getS3Client().send(command);

        } catch (error) {
            console.log('error while delete the S3 object', error);
            throw error
        }
    }



}
