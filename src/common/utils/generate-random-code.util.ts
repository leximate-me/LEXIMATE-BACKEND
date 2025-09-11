import { randomBytes } from 'crypto';

export function generateRandomCode(length = 6): string {
  // Define un alfabeto que incluye números, letras minúsculas y mayúsculas
  const alphabet =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const alphabetLength = alphabet.length;

  let code = '';
  // Genera una secuencia de bytes aleatorios para mayor seguridad
  const bytes = randomBytes(length);

  // Mapea cada byte a un carácter del alfabeto
  for (let i = 0; i < length; i++) {
    const randomIndex = bytes[i] % alphabetLength;
    code += alphabet[randomIndex];
  }

  return code;
}
