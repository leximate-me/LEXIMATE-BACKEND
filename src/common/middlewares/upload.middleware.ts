import {
  uploadImage,
  deleteImage,
  uploadPdfBufferAsImages,
} from '../libs/cloudinary';
import { uploadPdfToStorj } from '../libs/storj'; // 👈 importa tu función
import { Request, Response, NextFunction } from 'express';
import { UploadApiResponse } from 'cloudinary';
import { logger } from '../configs/logger.config';
import { EnvConfiguration } from '../configs/env.config';
import { ToolService } from '../../modules/tool/tool.service';

const uploadToStorage = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.file) {
    return next();
  }

  try {
    if (
      req.file.mimetype === 'application/pdf' &&
      req.baseUrl.includes('/task')
    ) {
      const toolService = new ToolService();

      await toolService.sendFilesToChatBot(
        [req.file],
        req.cookies.token as string
      );

      const filename = `${Date.now()}_${req.file.originalname}`;
      const url = await uploadPdfToStorj(
        req.file.buffer,
        filename,
        EnvConfiguration().storjBucket
      );
      req.file.cloudinaryUrl = url;
      req.file.cloudinaryPublicId = filename;
      logger.info('Archivo PDF subido a Storj');
      return next();
    }

    // PDF fuera de tareas → Cloudinary como imagen
    if (req.file.mimetype === 'application/pdf') {
      const result = await uploadPdfBufferAsImages(req.file.buffer);
      req.file.cloudinaryUrl = result.secure_url;
      req.file.cloudinaryPublicId = result.public_id;
      logger.info('Archivo pdf subido a Cloudinary como imagen');
      return next();
    }

    // Imágenes → Cloudinary
    const result: UploadApiResponse = await uploadImage(req.file.buffer);
    req.file.cloudinaryUrl = result.secure_url;
    req.file.cloudinaryPublicId = result.public_id;
    logger.info('Imagen subida a Cloudinary');
    return next();
  } catch (error) {
    next(error);
  }
};

const deleteFromCloudinary = async (
  publicId: string,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await deleteImage(publicId);
    return result;
  } catch (error) {
    next(error);
  }
};

export { uploadToStorage, deleteFromCloudinary };
