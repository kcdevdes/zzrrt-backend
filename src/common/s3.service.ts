import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private cloudFrontDomain: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });

    this.cloudFrontDomain = this.configService.get<string>(
      'AWS_CLOUDFRONT_DOMAIN',
    );
  }

  async uploadFile(
    buffer: Buffer,
    extension: string,
    mimetype: string,
  ): Promise<string> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const key = `uploads/img-${uuid()}${extension}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    });

    try {
      await this.s3Client.send(command);
      return `https://${this.cloudFrontDomain}/${key}`;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to upload file to S3`);
    }
  }
}
