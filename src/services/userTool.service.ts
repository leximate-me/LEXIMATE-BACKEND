import pdf from 'pdf-parse';
import mammoth from 'mammoth';

const extractTextFromPdfService = async (
  pdfBuffer: Buffer
): Promise<string[]> => {
  try {
    const data = await pdf(pdfBuffer);

    let text = data.text;
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
  docxBuffer: Buffer
): Promise<string[]> => {
  try {
    const data = await mammoth.extractRawText({ buffer: docxBuffer });

    let text = data.value;
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
