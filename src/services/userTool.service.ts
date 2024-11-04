// import pdf from 'pdf-parse';
import { PDF_CONFIG } from '../configs/pdf.config';

const extractTextFromPdfService = async (
  pdfBuffer: Buffer
): Promise<string[]> => {
  try {
    const formData = new FormData();
    formData.append(
      'file',
      new Blob([pdfBuffer], { type: 'application/pdf' }),
      'file.pdf'
    );
    formData.append('word_style', 'on');
    formData.append('output_type', 'json');

    const response = await fetch(`${PDF_CONFIG.url}/extracted-text`, {
      method: 'POST',
      headers: {
        'Api-Key': PDF_CONFIG.apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
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
