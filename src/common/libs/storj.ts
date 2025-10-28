import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { EnvConfiguration } from '../configs/env.config';

const storjClient = new S3Client({
  endpoint: EnvConfiguration().storjEndpoint,
  region: 'us-east-1', // Storj ignora la región, pero AWS SDK la requiere
  credentials: {
    accessKeyId: EnvConfiguration().storjAccessKey,
    secretAccessKey: EnvConfiguration().storjSecretKey,
  },
});

export async function uploadPdfToStorj(
  buffer: Buffer,
  filename: string,
  bucket: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: filename,
    Body: buffer,
    ContentType: 'application/pdf',
  });

  await storjClient.send(command);

  // Construye la URL pública (usando linksharing)
  // Cambia 'jvsyqtcsbj45ojgngkpzoo56z7mq' por tu ID de acceso público si es necesario
  const url = `https://link.storjshare.io/s/${EnvConfiguration().storjPublicId}/${bucket}/${filename}`;
  return url;
}
