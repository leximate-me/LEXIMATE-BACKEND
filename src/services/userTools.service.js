import fs from 'fs/promises';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

const extractTextFromPdfService = async (pdfPath) => {
  try {
    const dataBuffer = await fs.readFile(pdfPath);
    const data = await pdf(dataBuffer);
    return data.text; // Retorna el texto extraído
  } catch (error) {
    throw new Error(error);
  }
};

const extractTextFromDocxService = async (docxPath) => {
  try {
    const dataBuffer = await fs.readFile(docxPath);
    const data = await mammoth.extractRawText({ buffer: dataBuffer });
    return data.value; // Retorna el texto extraído
  } catch (error) {
    throw new Error(error);
  }
};

export { extractTextFromPdfService, extractTextFromDocxService };
