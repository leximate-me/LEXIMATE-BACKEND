import {
  uploadImage,
  deleteImage,
  uploadPdfBufferAsImages,
} from '../libs/cloudinary';
import { uploadPdfToStorj } from '../libs/storj';
import { UploadApiResponse } from 'cloudinary';
import { EnvConfiguration } from '../configs/env.config';
import { ToolService } from '../../modules/tool/tool.service';
import { FastifyRequest, FastifyReply } from 'fastify';

export const uploadToStorage = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const file = await request.file();
  if (!file) return;

  try {
    const buffer = await file.toBuffer();
    let fileProps = null;

    if (file.mimetype === 'application/pdf' && request.url.includes('/task')) {
      const toolService = new ToolService();
      await toolService.sendFilesToChatBot(
        [
          {
            buffer,
            originalname: file.filename,
            mimetype: file.mimetype,
          } as any,
        ],
        request.cookies?.token as string
      );
      const filename = `${Date.now()}_${file.filename}`;
      const url = await uploadPdfToStorj(
        buffer,
        filename,
        EnvConfiguration().storjBucket
      );
      fileProps = {
        fileUrl: url,
        fileId: filename,
        fileType: file.mimetype,
      };
    } else if (file.mimetype === 'application/pdf') {
      const result = await uploadPdfBufferAsImages(buffer);
      fileProps = {
        fileUrl: result.secure_url,
        fileId: result.public_id,
        fileType: file.mimetype,
      };
    } else {
      const result: UploadApiResponse = await uploadImage(buffer);
      fileProps = {
        fileUrl: result.secure_url,
        fileId: result.public_id,
        fileType: file.mimetype,
      };
    }

    // Adjunta solo fileProps al request
    (request as any).fileProps = fileProps;
  } catch (error) {
    reply.code(500).send({ message: 'Error al subir archivo', error });
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await deleteImage(publicId);
};
