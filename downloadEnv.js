import DopplerSDK from '@dopplerhq/node-sdk';
import fs from 'fs';
import dotenv from 'dotenv';
import { logger } from './src/configs/loggerConfig.js';

dotenv.config();

const doppler = new DopplerSDK({
  accessToken: process.env.DOPPLER_ACCESS_TOKEN,
});

const downloadEnvVariables = async () => {
  try {
    const secretsResponse = await doppler.secrets.download(
      process.env.DOPPLER_PROJECT,
      process.env.DOPPLER_CONFIG,
      {
        includeDynamicSecrets: true,
        dynamicSecretsTtlSec: 1800,
      }
    );

    if (secretsResponse) {
      const secrets = secretsResponse;
      logger.child({ secrets }).info('Secretos descargados de Doppler');

      // Leer las variables de entorno existentes del archivo .env
      const existingEnv = dotenv.parse(fs.readFileSync('.env'));

      // Fusionar las variables existentes con las nuevas variables descargadas
      const mergedEnv = { ...existingEnv, ...secrets };

      // Escribir las variables de entorno fusionadas en un archivo .env
      const envVars = Object.entries(mergedEnv)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
      fs.writeFileSync('.env', envVars);

      logger.info(
        'Variables de entorno descargadas y guardadas en el archivo .env'
      );
    } else {
      throw new Error('No se recibieron secretos de Doppler');
    }
  } catch (error) {
    logger.error(error, 'Error al descargar las variables de entorno');
  }
};

downloadEnvVariables();
