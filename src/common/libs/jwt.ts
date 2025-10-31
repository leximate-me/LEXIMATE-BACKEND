import jwt from 'jsonwebtoken';

interface PayloadData {
  [key: string]: any;
}

const createAccessToken = async (payload: PayloadData): Promise<string> => {
  try {
    const token = await new Promise<string>((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' },
        (err, token) => {
          if (err) {
            console.log('Error al crear el token:', err);
            reject(err);
          }
          resolve(token as string);
        }
      );
    });
    return token;
  } catch (error) {
    throw new Error('Error al crear el token');
  }
};

export { createAccessToken };
