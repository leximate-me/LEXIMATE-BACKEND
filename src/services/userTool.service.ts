import fs from 'fs/promises';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

const extractTextFromPdfService = async (
  pdfPath: string
): Promise<string[]> => {
  try {
    const dataBuffer = await fs.readFile(pdfPath);
    const data = await pdf(dataBuffer);

    let text = data.text;
    console.log(typeof text);
    text = text.replace(/\n/g, '  '); // Usar expresión regular global

    const textArray = text.split('  ');

    return textArray; // Retorna el texto extraído
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Error desconocido al extraer texto del archivo PDF');
    }
  }
};

const extractTextFromDocxService = async (
  docxPath: string
): Promise<string[]> => {
  try {
    const dataBuffer = await fs.readFile(docxPath);
    const data = await mammoth.extractRawText({ buffer: dataBuffer });

    let text = data.value;
    console.log(typeof text);
    text = text.replace(/\n/g, '  '); // Usar expresión regular global

    const textArray = text.split('  ');

    return textArray; // Retorna el texto extraído
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Error desconocido al extraer texto del archivo DOCX');
    }
  }
};

export { extractTextFromPdfService, extractTextFromDocxService };
