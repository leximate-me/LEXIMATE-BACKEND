import { uploadImage, deleteImage } from '../libs/cloudinary';
import { Request, Response, NextFunction } from 'express';
import { UploadApiResponse } from 'cloudinary';

const uploadToCloudinary = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.file) {
    return next(new Error('No file uploaded.'));
  }

  try {
    const result: UploadApiResponse = await uploadImage(req.file.buffer);
    req.file.cloudinaryUrl = result.secure_url;
    req.file.cloudinaryPublicId = result.public_id;
    next();
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
