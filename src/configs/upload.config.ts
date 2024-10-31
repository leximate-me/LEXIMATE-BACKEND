import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

// storage
const storage = multer.memoryStorage();

// limits
const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB
};

// filters
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type.'));
  }
};

const upload = multer({
  storage,
  limits,
  fileFilter,
}).single('file'); // Asegúrate de que el campo del archivo en el formulario es 'file'

export { upload };
