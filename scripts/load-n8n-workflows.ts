import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const N8N_API_URL = process.env.N8N_API_URL || 'http://localhost:5678';
const N8N_API_KEY = process.env.N8N_API_KEY;

console.log(`N8N_API_URL: ${N8N_API_URL}`);
console.log(`N8N_API_KEY: ${N8N_API_KEY}`);

interface Workflow {
  name: string;
  nodes: any[];
  connections: any[];
  active?: boolean;
  settings?: any;
}

// Propiedades válidas de settings según n8n
const VALID_SETTINGS_KEYS = [
  'timezone',
  'saveDataErrorExecution',
  'saveDataSuccessExecution',
  'saveManualExecutions',
  'timezone',
];

function cleanSettings(settings: any): any {
  if (!settings || typeof settings !== 'object') {
    return {};
  }

  const cleaned: any = {};

  // Solo mantén las propiedades válidas
  VALID_SETTINGS_KEYS.forEach((key) => {
    if (key in settings) {
      cleaned[key] = settings[key];
    }
  });

  return cleaned;
}

async function loadWorkflows() {
  try {
    const workflowsDir = path.join(__dirname, '../n8n/workflows');

    try {
      await fs.mkdir(workflowsDir, { recursive: true });
    } catch (e) {
      // Carpeta ya existe
    }

    const files = await fs.readdir(workflowsDir);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));

    console.log(`\n📁 Encontrados ${jsonFiles.length} workflows\n`);

    if (jsonFiles.length === 0) {
      console.log('⚠ No hay workflows para cargar\n');
      return;
    }

    for (const file of jsonFiles) {
      const filePath = path.join(workflowsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const workflow: Workflow = JSON.parse(content);

      console.log(`📝 Procesando: ${workflow.name}`);

      try {
        const existingWorkflows = await axios.get(
          `${N8N_API_URL}/api/v1/workflows`,
          {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY },
            timeout: 10000,
          }
        );

        const existing = existingWorkflows.data.data.find(
          (w: any) => w.name === workflow.name
        );

        // Limpia el settings antes de enviar
        const cleanedSettings = cleanSettings(workflow.settings);

        const workflowBody = {
          name: workflow.name,
          nodes: workflow.nodes || [],
          connections: workflow.connections || {},
          settings: cleanedSettings,
        };

        if (existing) {
          // Actualiza el workflow existente
          await axios.put(
            `${N8N_API_URL}/api/v1/workflows/${existing.id}`,
            workflowBody,
            {
              headers: { 'X-N8N-API-KEY': N8N_API_KEY },
              timeout: 10000,
            }
          );
          console.log(`✅ Workflow actualizado: ${workflow.name}`);

          // Activa/desactiva el workflow por separado
          if (workflow.active) {
            await axios.post(
              `${N8N_API_URL}/api/v1/workflows/${existing.id}/activate`,
              {},
              {
                headers: { 'X-N8N-API-KEY': N8N_API_KEY },
                timeout: 10000,
              }
            );
            console.log(`🟢 Workflow activado: ${workflow.name}\n`);
          } else {
            await axios.post(
              `${N8N_API_URL}/api/v1/workflows/${existing.id}/deactivate`,
              {},
              {
                headers: { 'X-N8N-API-KEY': N8N_API_KEY },
                timeout: 10000,
              }
            );
            console.log(`🔴 Workflow desactivado: ${workflow.name}\n`);
          }
        } else {
          // Crea un nuevo workflow
          const createResponse = await axios.post(
            `${N8N_API_URL}/api/v1/workflows`,
            workflowBody,
            {
              headers: { 'X-N8N-API-KEY': N8N_API_KEY },
              timeout: 10000,
            }
          );
          console.log(`✅ Workflow creado: ${workflow.name}`);

          const newWorkflowId = createResponse.data.id;

          // Activa/desactiva el workflow por separado
          if (workflow.active) {
            await axios.post(
              `${N8N_API_URL}/api/v1/workflows/${newWorkflowId}/activate`,
              {},
              {
                headers: { 'X-N8N-API-KEY': N8N_API_KEY },
                timeout: 10000,
              }
            );
            console.log(`🟢 Workflow activado: ${workflow.name}\n`);
          } else {
            console.log(`🔴 Workflow desactivado: ${workflow.name}\n`);
          }
        }
      } catch (error: any) {
        console.error(
          `❌ Error al procesar ${workflow.name}:`,
          error.response?.data?.message || error.message
        );
        if (error.response?.data) {
          console.error(`   Detalles:`, error.response.data);
        }
        console.log('');
      }
    }

    console.log('✨ Proceso de carga de workflows completado\n');
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
    console.log('🚀 Iniciando carga de workflows...\n');
    console.log('═'.repeat(50));
    console.log('');

    await waitForN8n();
    await loadWorkflows();

    console.log('═'.repeat(50));
    console.log('');
    console.log('✨ Workflows cargados exitosamente!\n');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
