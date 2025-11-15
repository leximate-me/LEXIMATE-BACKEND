import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const N8N_API_URL = process.env.N8N_API_URL || 'http://localhost:5678';
const N8N_API_KEY = process.env.N8N_API_KEY;

console.log(`N8N_API_URL: ${N8N_API_URL}`);
console.log(`N8N_API_KEY: ${N8N_API_KEY}`);

interface Credential {
  name: string;
  type: string;
  data: Record<string, any>;
}

// Mapea las variables de entorno a credenciales de n8n
const credentialsFromEnv: Credential[] = [
  {
    name: 'Google PaLM API',
    type: 'googlePalmApi',
    data: {
      host: process.env.GOOGLE_PALM_HOST || '',
      apiKey: process.env.GOOGLE_GEMINI_API_KEY || '',
    },
  },
  {
    name: 'Supabase Vector Store',
    type: 'supabaseApi',
    data: {
      host: process.env.SUPABASE_HOST || '',
      serviceRole: process.env.SERVICE_ROLE_SECRET || '',
    },
  },
  {
    name: 'PostgreSQL Account',
    type: 'postgres',
    data: {
      host: process.env.POSTGRES_DB_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_DB_PORT || '5432'),
      database: process.env.POSTGRES_DB_NAME || '',
      user: process.env.POSTGRES_DB_USER || '',
      password: process.env.POSTGRES_DB_PASSWORD || '',
      ssl: 'disable',
      allowUnauthorizedCerts: false,
      sshTunnel: false,
    },
  },
  {
    name: 'JWT Auth',
    type: 'jwtAuth',
    data: {
      keyType: 'passphrase',
      secret: process.env.JWT_SECRET_KEY || '',
      privateKey: '',
      publicKey: '',
      algorithm: 'HS256',
    },
  },
];

async function getExistingCredentials() {
  try {
    const response = await axios.get(`${N8N_API_URL}/api/v1/credentials`, {
      headers: { 'X-N8N-API-KEY': N8N_API_KEY },
      timeout: 10000,
    });
    return response.data.data || [];
  } catch (error: any) {
    console.log(
      '⚠️ No se pudieron obtener credenciales existentes, creando nuevas...\n'
    );
    return [];
  }
}

async function deleteCredential(credentialId: string, name: string) {
  try {
    await axios.delete(`${N8N_API_URL}/api/v1/credentials/${credentialId}`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
      },
      timeout: 10000,
    });
    console.log(`🗑️  Credencial eliminada: ${name}`);
    return true;
  } catch (error: any) {
    console.error(
      `❌ Error al eliminar ${name}:`,
      error.response?.data?.message || error.message
    );
    return false;
  }
}

async function loadCredentials() {
  try {
    const credentialsDir = path.join(__dirname, '../n8n/credentials');

    try {
      await fs.mkdir(credentialsDir, { recursive: true });
    } catch (e) {
      // Carpeta ya existe
    }

    const files = await fs.readdir(credentialsDir);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));

    let credentialsToLoad: Credential[] = [];

    // Si hay archivos JSON, úsalos
    if (jsonFiles.length > 0) {
      console.log(
        `\n📁 Encontrados ${jsonFiles.length} archivos de credenciales\n`
      );

      for (const file of jsonFiles) {
        const filePath = path.join(credentialsDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const credential: Credential = JSON.parse(content);
        credentialsToLoad.push(credential);
      }
    } else {
      // Si no hay archivos JSON, usa las variables de entorno
      console.log(`\n🔑 Cargando credenciales desde .env\n`);
      credentialsToLoad = credentialsFromEnv.filter((c) => {
        // Filtra las credenciales que tengan datos válidos
        const hasData = Object.values(c.data).some(
          (v) => v !== '' && v !== 0 && v !== false
        );
        if (!hasData) {
          console.log(`⚠ Omitiendo ${c.name} - no configurada en .env`);
        }
        return hasData;
      });
    }

    console.log(
      `\n📁 Encontradas ${credentialsToLoad.length} credenciales para cargar\n`
    );

    if (credentialsToLoad.length === 0) {
      console.log('⚠ No hay credenciales para cargar\n');
      return;
    }

    // Obtén las credenciales existentes
    const existingCredentials = await getExistingCredentials();
    console.log(
      `📋 Credenciales existentes en n8n: ${existingCredentials.length}\n`
    );

    for (const credential of credentialsToLoad) {
      console.log(`🔐 Procesando: ${credential.name}`);

      try {
        // Busca si la credencial ya existe
        const existing = existingCredentials.find(
          (c: any) => c.name === credential.name
        );

        if (existing) {
          // Elimina la credencial existente
          console.log(`   Reemplazando credencial existente...`);
          const deleted = await deleteCredential(existing.id, credential.name);

          if (deleted) {
            // Espera un momento antes de crear la nueva
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Crea una nueva credencial
            await axios.post(
              `${N8N_API_URL}/api/v1/credentials`,
              {
                name: credential.name,
                type: credential.type,
                data: credential.data,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'X-N8N-API-KEY': N8N_API_KEY,
                },
                timeout: 10000,
              }
            );
            console.log(`✅ Credencial reemplazada: ${credential.name}\n`);
          }
        } else {
          // Crea una nueva credencial
          await axios.post(
            `${N8N_API_URL}/api/v1/credentials`,
            {
              name: credential.name,
              type: credential.type,
              data: credential.data,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'X-N8N-API-KEY': N8N_API_KEY,
              },
              timeout: 10000,
            }
          );
          console.log(`✅ Credencial creada: ${credential.name}\n`);
        }
      } catch (error: any) {
        console.error(
          `❌ Error al procesar ${credential.name}:`,
          error.response?.data?.message || error.message,
          '\n'
        );
      }
    }

    console.log('✨ Proceso de carga de credenciales completado\n');
  } catch (error) {
    console.error('Error fatal:', error);
    process.exit(1);
  }
}

async function waitForN8n() {
  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    try {
      console.log(`🔍 Intentando conectar a ${N8N_API_URL}...`);
      const response = await axios.get(`${N8N_API_URL}/api/v1/workflows`, {
        timeout: 15000,
        headers: { 'X-N8N-API-KEY': N8N_API_KEY },
      });
      console.log('✅ n8n está listo\n');
      console.log(`Respuesta: ${response.status}\n`);
      return true;
    } catch (error: any) {
      attempts++;
      console.log(`⏳ Esperando n8n... (${attempts}/${maxAttempts})`);
      console.log(`   Error: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  throw new Error('n8n no se pudo conectar después de 60 segundos');
}

async function main() {
  try {
    console.log('🚀 Iniciando carga de credenciales...\n');
    console.log('═'.repeat(50));
    console.log('');

    await waitForN8n();
    await loadCredentials();

    console.log('═'.repeat(50));
    console.log('');
    console.log('✨ Credenciales cargadas exitosamente!\n');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
