import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from '../configs/env.config';
import { logger } from '../configs/logger.config';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadImage = (buffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'api' },
      (error, result) => {
        if (error) {
          logger.child({ error }).error('Error al subir la imagen');
          reject(error);
        }
        return result ? resolve(result) : reject('Error al devolver la imagen');
      }
    );

    stream.end(buffer);
  });
};

const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    return logger.child({ error }).error('Error al eliminar la imagen');
  }
};

export { uploadImage, deleteImage, cloudinary };
