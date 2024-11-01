import multer from 'multer';
import { Request } from 'express';

// Configuración de almacenamiento en memoria
const storage = multer.memoryStorage();

// Configuración de límites de archivo
const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB
};

// Filtro de archivos para aceptar solo imágenes
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido.'));
  }
};

// Configuración de `multer`
const upload = multer({
  storage,
  limits,
  fileFilter,
}).single('file');

export { upload };
