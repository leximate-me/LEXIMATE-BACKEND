import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = (buffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'api' },
      (error, result) => {
        if (error) {
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
    throw new Error('Error al eliminar la imagen');
  }
};

export { uploadImage, deleteImage, cloudinary, uploadPdfBufferAsImages };
