import fs from 'fs';
import path from 'path';

export async function uploadPdfToLocal(
  buffer: Buffer,
  filename: string,
  publicDir = path.join(process.cwd(), 'public')
): Promise<string> {
  // Asegura que la carpeta exista
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const filePath = path.join(publicDir, filename);
  await fs.promises.writeFile(filePath, buffer);

  // Retorna la URL local (ajusta si usas un prefijo distinto)
  return `/public/${filename}`;
}
