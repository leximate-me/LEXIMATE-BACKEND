import { pdfConfig } from '../configs/pdf.config';

const extractTextFromPdfService = async (
  pdfBuffer: Buffer
): Promise<string[]> => {
  try {
    // Paso 1: Autenticación
    const authResponse = await fetch(`${pdfConfig.url}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_key: pdfConfig.publicKey,
        secret_key: pdfConfig.secretKey,
      }),
    });

    if (!authResponse.ok) {
      throw new Error(`Error de autenticación: ${authResponse.statusText}`);
    }

    const authData = await authResponse.json();
    const token = authData.token;

    // Paso 2: Subir el archivo
    const formData = new FormData();
    formData.append(
      'file',
      new Blob([pdfBuffer], { type: 'application/pdf' }),
      'file.pdf'
    );

    const uploadResponse = await fetch(`${pdfConfig.url}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(
        `Error al subir el archivo: ${uploadResponse.statusText}`
      );
    }

    const uploadData = await uploadResponse.json();
    const fileId = uploadData.server_filename;

    // Paso 3: Extraer texto
    const taskResponse = await fetch(`${pdfConfig.url}/extract-text`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: [{ server_filename: fileId }],
      }),
    });

    if (!taskResponse.ok) {
      throw new Error(`Error al extraer texto: ${taskResponse.statusText}`);
    }

    const taskData = await taskResponse.json();
    const text = taskData.text;
    const textArray = text.split('\n');

    return textArray;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Error desconocido al extraer texto del archivo PDF');
    }
  }
};

// const extractTextFromDocxService = async (
//   docxBuffer: Buffer
// ): Promise<string[]> => {
//   try {
//     const data = await mammoth.extractRawText({ buffer: docxBuffer });

//     let text = data.value;
//     text = text.replace(/\n/g, '  '); // Usar expresión regular global

//     const textArray = text.split('  ');

//     return textArray; // Retorna el texto extraído
//   } catch (error) {
//     if (error instanceof Error) {
//       throw new Error(error.message);
//     } else {
//       throw new Error('Error desconocido al extraer texto del archivo DOCX');
//     }
//   }
// };

export { extractTextFromPdfService };
