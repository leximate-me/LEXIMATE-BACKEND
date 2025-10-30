import { uploadImage, deleteImage } from '../libs/cloudinary';
import { uploadPdfToLocal } from '../libs/local-storage'; // 👈 Usa el nuevo adapter
import { UploadApiResponse } from 'cloudinary';
import { EnvConfiguration } from '../configs/env.config';
import { ToolService } from '../../modules/tool/tool.service';
import { FastifyRequest, FastifyReply } from 'fastify';

export const uploadToStorage = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (request.isMultipart && request.isMultipart()) {
    const parts = request.parts();
    let fileProps = null;
    const fields: Record<string, any> = {};

    for await (const part of parts) {
      if (part.type === 'file') {
        const buffer = await part.toBuffer();

        if (
          part.mimetype === 'application/pdf' &&
          request.url.includes('/task')
        ) {
          const toolService = new ToolService();
          await toolService.sendFilesToChatBot(
            [
              {
                buffer,
                originalname: part.filename,
                mimetype: part.mimetype,
              } as any,
            ],
            request.cookies?.token as string
          );
        }
        // Sube el PDF de forma local usando el adapter
        if (part.mimetype === 'application/pdf') {
          const filename = `${Date.now()}_${part.filename}`;
          const url = await uploadPdfToLocal(buffer, filename);
          fileProps = {
            fileUrl: url,
            fileId: filename,
            fileType: part.mimetype,
          };
        } else {
          const result: UploadApiResponse = await uploadImage(buffer);
          fileProps = {
            fileUrl: result.secure_url,
            fileId: result.public_id,
            fileType: part.mimetype,
          };
        }
        (request as any).fileProps = fileProps;
      } else if (part.type === 'field') {
        fields[part.fieldname] = part.value;
      }
    }
    (request.body as any) = fields;
  } else {
    const file = await request.file();
    if (!file) return;

    try {
      const buffer = await file.toBuffer();
      let fileProps = null;

      if (
        file.mimetype === 'application/pdf' &&
        request.url.includes('/task')
      ) {
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
      }
      // Sube el PDF de forma local usando el adapter
      if (file.mimetype === 'application/pdf') {
        const filename = `${Date.now()}_${file.filename}`;
        const url = await uploadPdfToLocal(buffer, filename);
        fileProps = {
          fileUrl: url,
          fileId: filename,
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

      (request as any).fileProps = fileProps;
    } catch (error) {
      reply.code(500).send({ message: 'Error al subir archivo', error });
    }
  }
};
