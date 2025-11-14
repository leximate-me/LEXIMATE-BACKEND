import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';

const N8N_API_URL = process.env.N8N_API_URL || 'http://localhost:5678';
const N8N_API_KEY = process.env.N8N_API_KEY;

interface Workflow {
  name: string;
  nodes: any[];
  connections: any[];
  active?: boolean;
  settings?: any;
}

async function loadWorkflows() {
  try {
    const workflowsDir = path.join(__dirname, '../n8n/workflows');

    // Crea la carpeta si no existe
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
        // Obtiene los workflows existentes
        const existingWorkflows = await axios.get(
          `${N8N_API_URL}/rest/workflows`,
          {
            headers: N8N_API_KEY ? { 'X-N8N-API-KEY': N8N_API_KEY } : {},
            timeout: 10000,
          }
        );

        const existing = existingWorkflows.data.data.find(
          (w: any) => w.name === workflow.name
        );

        if (existing) {
          // Actualiza el workflow existente
          await axios.put(
            `${N8N_API_URL}/rest/workflows/${existing.id}`,
            {
              name: workflow.name,
              nodes: workflow.nodes,
              connections: workflow.connections,
              active: workflow.active ?? false,
              settings: workflow.settings ?? {},
            },
            {
              headers: N8N_API_KEY ? { 'X-N8N-API-KEY': N8N_API_KEY } : {},
              timeout: 10000,
            }
          );
          console.log(`✅ Workflow actualizado: ${workflow.name}\n`);
        } else {
          // Crea un nuevo workflow
          await axios.post(
            `${N8N_API_URL}/rest/workflows`,
            {
              name: workflow.name,
              nodes: workflow.nodes,
              connections: workflow.connections,
              active: workflow.active ?? false,
              settings: workflow.settings ?? {},
            },
            {
              headers: N8N_API_KEY ? { 'X-N8N-API-KEY': N8N_API_KEY } : {},
              timeout: 10000,
            }
          );
          console.log(`✅ Workflow creado: ${workflow.name}\n`);
        }
      } catch (error: any) {
        console.error(
          `❌ Error al procesar ${workflow.name}:`,
          error.response?.data?.message || error.message,
          '\n'
        );
      }
    }

    console.log('✨ Proceso de carga de workflows completado\n');
  } catch (error) {
    console.error('Error fatal:', error);
    process.exit(1);
  }
}

// Espera a que n8n esté listo
async function waitForN8n() {
  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    try {
      await axios.get(`${N8N_API_URL}/rest/workflows`, {
        timeout: 5000,
        headers: N8N_API_KEY ? { 'X-N8N-API-KEY': N8N_API_KEY } : {},
      });
      console.log('✅ n8n está listo\n');
      return true;
    } catch (error) {
      attempts++;
      console.log(`⏳ Esperando n8n... (${attempts}/${maxAttempts})`);
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
