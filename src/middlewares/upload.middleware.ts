import {
  uploadImage,
  deleteImage,
  uploadPdfBufferAsImages,
} from '../libs/cloudinary';
import { Request, Response, NextFunction } from 'express';
import { UploadApiResponse } from 'cloudinary';
import { logger } from '../configs/logger.config';

const uploadToCloudinary = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.file) {
    return next(new Error('No se ha subido ningún archivo.'));
  }

  try {
    if (req.file.mimetype === 'application/pdf') {
      const result = await uploadPdfBufferAsImages(req.file.buffer);
      req.file.cloudinaryUrl = result.secure_url;
      req.file.cloudinaryPublicId = result.public_id;
      logger.info('Archivo pdf subido a Cloudinary como imagen');
      return next();
    }
    const result: UploadApiResponse = await uploadImage(req.file.buffer);
    req.file.cloudinaryUrl = result.secure_url;
    req.file.cloudinaryPublicId = result.public_id;

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

export { uploadToCloudinary, deleteFromCloudinary };
