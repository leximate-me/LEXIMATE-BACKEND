import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { EnvConfiguration } from '../configs/env.config';
import { logger } from '../configs/logger.config';

cloudinary.config({
  cloud_name: EnvConfiguration().cloudinaryCloudName,
  api_key: EnvConfiguration().cloudinaryApiKey,
  api_secret: EnvConfiguration().cloudinaryApiSecret,
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

const uploadPdfBufferAsImages = async (
  fileBuffer: Buffer
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const result = cloudinary.uploader.upload_stream(
      {
        folder: 'api',
        resource_type: 'auto',
        format: 'png',
      },
      (error, result) => {
        if (error) {
          logger.child({ error }).error('Error al subir la imagen');
          reject(error);
        }
        return result ? resolve(result) : reject('Error al devolver la imagen');
      }
    );

    result.end(fileBuffer);
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

export { uploadImage, deleteImage, cloudinary, uploadPdfBufferAsImages };
