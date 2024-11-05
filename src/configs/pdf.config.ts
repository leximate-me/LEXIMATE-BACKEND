import { ILOVEPDF_API_PUBLIC_KEY, ILOVEPDF_API_SECRET_KEY } from './env.config';

const ILOVEPDF_URL = 'https://api.ilovepdf.com/v1';

const pdfConfig = {
  url: ILOVEPDF_URL,
  publicKey: ILOVEPDF_API_PUBLIC_KEY,
  secretKey: ILOVEPDF_API_SECRET_KEY,
};

export { pdfConfig };
